/**
 * This file contains the logic for reconciling the budget of a trip.
 * Main sources: https://www.geeksforgeeks.org/minimize-cash-flow-among-given-set-friends-borrowed-money/
 */


export interface Transaction {
    from: string;
    to: string;
    amount: number;
}

export interface TripMemberSummary {
    member: string;
    totalCost: number;
    totalPayment: number;
}

export const reconcileBalances = (tripMemberSummary: TripMemberSummary[]): {
    transactions: Transaction[],
    error?: string
} => {

    const balances: { [member: string]: number } = {};

    tripMemberSummary.forEach(({member, totalCost, totalPayment}) => {
        balances[member] = (balances[member] || 0) + totalPayment - totalCost;
    });

    const totalBalance = Object.values(balances).reduce((acc, balance) => acc + balance, 0);
    if (totalBalance !== 0) {
        return {transactions: [], error: "Balances do not sum to zero."};
    }

    const creditors: { member: string; balance: number }[] = [];
    const debtors: { member: string; balance: number }[] = [];

    Object.entries(balances).forEach(([member, balance]) => {
        if (balance > 0) {
            creditors.push({member, balance});
        } else if (balance < 0) {
            debtors.push({member, balance: -balance});
        }
    });

    const transactions: Transaction[] = [];

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
        const creditor = creditors[i];
        const debtor = debtors[j];

        const amount = Math.min(creditor.balance, debtor.balance);
        transactions.push({from: debtor.member, to: creditor.member, amount});

        creditor.balance -= amount;
        debtor.balance -= amount;

        if (creditor.balance === 0) i++;
        if (debtor.balance === 0) j++;
    }

    return {transactions};
};
