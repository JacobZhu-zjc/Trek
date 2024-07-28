// import { TripBudget, TripItem, Trip } from "../trip";
// import { p0, p1, ar0, ar1, ar2 } from "./destinationExamples";
// import { user1, user2, user3 } from "./userExamples";
//
//
// const tripBudget: TripBudget = {
//     baseCurrency: "CAD",
//     tripBudgetCategoriesGroupCost: [
//         { category: "Activities", value: 500 },
//         { category: "Accommodation", value: 1000 },
//         { category: "Food and Restaurants", value: 300 },
//         { category: "Transportation", value: 200 },
//         { category: "Gifts and Souvenirs", value: 100 },
//         { category: "Other", value: 50 }
//     ],
//     tripTotalGroupCost: 2150,
//     tripTotalPayments: 2150,
//     tripMemberPayments: [
//         { memberId: user1._id, memberName: user1.name, value: 1000 },
//         { memberId: user2._id, memberName: user2.name, value: 750 },
//         { memberId: user3._id, memberName: user3.name, value: 400 }
//     ]
// };
//
// const tripItems: TripItem[] = [
//     {
//         item_id: "item1",
//         item_type: 'destination',
//         index: 0,
//         day: 0,
//         start_time: new Date("2024-07-01T10:00:00Z"),
//         end_time: new Date("2024-07-01T12:00:00Z"),
//         duration: 7200,
//         budget: {
//             currency: "CAD",
//             category: "Activities",
//             totalEstimatedCost: 100,
//             totalCost: 100,
//             totalPaidCost: 100,
//             membersBudget: [
//                 { memberId: user1._id, memberName: user1.name, estimatedCost: 50, cost: 50, paidValue: 50, paymentDate: new Date("2024-06-30"), paymentBaseCurrencyValue: 50 },
//                 { memberId: user2._id, memberName: user2.name, estimatedCost: 50, cost: 50, paidValue: 50, paymentDate: new Date("2024-06-30"), paymentBaseCurrencyValue: 50 }
//             ]
//         },
//         destination: p0,
//         photos: []
//     },
//     {
//         item_id: "item2",
//         item_type: 'destination',
//         index: 1,
//         day: 0,
//         start_time: new Date("2024-07-01T14:00:00Z"),
//         end_time: new Date("2024-07-01T16:00:00Z"),
//         duration: 7200,
//         budget: {
//             currency: "CAD",
//             category: "Activities",
//             totalEstimatedCost: 100,
//             totalCost: 100,
//             totalPaidCost: 100,
//             membersBudget: [
//                 { memberId: user2._id, memberName: user2.name, estimatedCost: 50, cost: 50, paidValue: 50, paymentDate: new Date("2024-06-30"), paymentBaseCurrencyValue: 50 },
//                 { memberId: user3._id, memberName: user3.name, estimatedCost: 50, cost: 50, paidValue: 50, paymentDate: new Date("2024-06-30"), paymentBaseCurrencyValue: 50 }
//             ]
//         },
//         destination: p1,
//         photos: []
//     }
// ];
//
// export const t0: Trip = {
//     name: "Vancouver Adventure",
//     _id: "0e971cb5-af41-4e39-a531-cb30309203e6",
//     desc: "An exciting trip exploring the best spots in Vancouver.",
//     ownerUser: user1,
//     nonOwnerUsers: [user2, user3],
//     date: {start: new Date("2024-07-01") , end: new Date("2024-07-05")},
//     // startDate: new Date("2024-07-01"),
//     // endDate: new Date("2024-07-05"),
//     budget: tripBudget,
//     trip_items: tripItems,
//     areas: [ar0, ar1, ar2],
//     // photos: [userUploadedImage0, userUploadedImage1, userUploadedImage2, userUploadedImage3, userUploadedImage4]
//     photos: []
// };
