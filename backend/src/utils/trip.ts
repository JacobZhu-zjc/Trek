import {tripModel} from "../routes/mongodb/schemas/tripModel";
import * as Y from 'yjs';
import {CategoryBudgetSummary, MemberBudget, MemberBudgetSummary, TripItem} from "../types/tripTypes";

export async function fetchTripItemsFromDatabase(roomId: string): Promise<Y.Doc> {
    const trip = await tripModel.findById(roomId);
    if (trip && trip.trip_items) {
        // Convert trip_items to a Yjs-compatible format (Uint8Array)
        const ydoc = new Y.Doc();
        const yArray = ydoc.getArray('items');
        const tripItemsWithoutNotes = trip.trip_items.map((item: any) => {
            return {
                _id: item._id,
                key: item.key,
                item_id: item.item_id,
                item_type: item.item_type,
                date: item.date,
                ...(item.budget && {budget: item.budget})
            }
        });

        yArray.insert(0, JSON.parse(JSON.stringify(tripItemsWithoutNotes))); // Insert trip items into the Yjs array
        return ydoc;
    }
    throw new Error("Trip not found in database!");
}

export const pushTripItemsToDatabase = async (roomId: string, ydoc: Y.Doc) => {
    if (ydoc) {
        const yArray = ydoc.getArray('items');
        const tripItems = yArray.toArray();
        const tripItemsDeserialized = deserializeTripItems(tripItems);

        await tripModel.findByIdAndUpdate(roomId, {trip_items: tripItemsDeserialized}, {upsert: true});
        await updateTripBudget(roomId);
    }
}

export const deserializeTripItems = (tripItems: any[]): any[] => {
    return tripItems.map((item) => {
        const newItem = {...item};

        if (item.date) {
            newItem.date = {};
            if (item.date.start) {
                newItem.date.start = new Date(item.date.start);
            }
            if (item.date.end) {
                newItem.date.end = new Date(item.date.end);
            }
        }

        return newItem;
    });
}

export const updateTripBudget = async (tripId: string) => {

    const trip = await tripModel.findById(tripId);

    if (trip && trip.trip_items) {

        console.log("Found trip items");

        let totalCost = 0;
        let totalPaidCost = 0;
        trip.budget.tripMemberSummary = [];
        trip.budget.tripBudgetCategoriesGroupCost =
            [
                {
                    category: "Activities",
                    value: 0
                },
                {
                    category: "Accommodation",
                    value: 0
                }, {
                category: "Transportation",
                value: 0
            }, {
                category: "Food and Restaurants",
                value: 0
            }, {
                category: "Activities",
                value: 0
            }, {
                category: "Gifts and Souvenirs",
                value: 0
            },
                {
                    category: "Other",
                    value: 0
                }
            ];

        trip.trip_items.forEach((item: TripItem) => {
            console.log("in for loop");
            if (item.budget) {
                totalCost += item.budget.totalCost || 0;
                totalPaidCost += item.budget.totalPaidCost || 0;

                if (item.budget.category || 'Other') {
                    const categoryIndex = trip.budget.tripBudgetCategoriesGroupCost.findIndex((categorySummary: CategoryBudgetSummary) => item.budget.category === categorySummary.category);

                    if (categoryIndex === -1) {
                        trip.budget.tripBudgetCategoriesGroupCost.push({
                            category: item.budget.category,
                            value: item.budget.totalCost || 0
                        } as CategoryBudgetSummary);
                    } else {
                        console.log("categoryIndex ", categoryIndex);
                        console.log("value ", item.budget.totalCost);
                        trip.budget.tripBudgetCategoriesGroupCost[categoryIndex].value += item.budget.totalCost || 0;
                    }
                } else {
                    // add it as "Other"
                    trip.budget.tripBudgetCategoriesGroupCost[6].value += item.budget.totalCost || 0;
                }

                // add member payments to tripMemberSummary
                item.budget.membersBudget.forEach((memberBudget: MemberBudget) => {

                    const memberIndex = trip.budget.tripMemberSummary.findIndex((memberSummary: MemberBudgetSummary) => memberSummary.member === memberBudget.member);

                    if (memberIndex === -1) {
                        trip.budget.tripMemberSummary.push({
                            member: memberBudget.member,
                            totalCost: memberBudget.cost_base_currency_amount || memberBudget.estimated_cost_base_currency_amount || 0,
                            totalPayment: memberBudget.payment_base_currency_amount || 0
                        } as MemberBudgetSummary);
                    } else {
                        trip.budget.tripMemberSummary[memberIndex].totalCost += (memberBudget.cost_base_currency_amount || memberBudget.estimated_cost_base_currency_amount || 0);
                        trip.budget.tripMemberSummary[memberIndex].totalPayment += memberBudget.payment_base_currency_amount || 0;
                    }

                });
                console.log("totalCost ", totalCost);
                console.log("totalPaidCost ", totalPaidCost);
            }
        });

        console.log("now finale");
        console.log("totalCost ", totalCost);
        console.log("totalPaidCost ", totalPaidCost);

        await tripModel.findByIdAndUpdate(tripId, {
            budget: {
                'tripBudgetCategoriesGroupCost': trip.budget.tripBudgetCategoriesGroupCost || 0,
                'tripMemberSummary': trip.budget.tripMemberSummary || 0,
                'tripTotalGroupCost': totalCost,
                'tripTotalPayments': totalPaidCost,
            }
        }, {useFindAndModify: false});
    }
}
