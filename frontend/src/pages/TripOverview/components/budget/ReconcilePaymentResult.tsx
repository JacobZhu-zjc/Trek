import React, {useEffect, useState} from 'react';
import {Text} from '@mantine/core';
import {reconcileBalances, Transaction, TripMemberSummary} from '../../../../hooks/ReconcileBudget';

const ReconcileBalancesComponent: React.FC<{ tripMemberSummary: TripMemberSummary[] }> = ({tripMemberSummary}) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const result = reconcileBalances(tripMemberSummary);

        if (result.error) {
            setIsError(true);
            setErrorMessage(result.error);
        } else {
            setTransactions(result.transactions);
        }
    }, [tripMemberSummary]);

    return (
        <div>
            {isError && <Text c={"red"}>Error: {errorMessage}</Text>}

            {!isError && transactions.length > 0 && (
                <div>
                    <h3>Transactions:</h3>
                    <ul>
                        {transactions.map((transaction, index) => (
                            <li key={index}>
                                {transaction.from} pays {transaction.to}: ${transaction.amount.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!isError && transactions.length === 0 && (
                <Text>No transactions needed to reconcile payments.</Text>
            )}
        </div>
    );
};

export default ReconcileBalancesComponent;
