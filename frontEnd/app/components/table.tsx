import React, { ChangeEvent, useEffect, useState } from 'react';

interface TableProps {
    columnName?: any[];
    datas?: any[];
    pagination?: any;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    onSelectPagination?: ((id: number) => void) | undefined;
    onEdit?: ((id: number) => void) | undefined;
    onDelete?: ((id: number) => void) | undefined;
}

const Table: React.FC<TableProps> = ({ columnName, pagination, datas, onSelectPagination, onEdit, onDelete }) => {
    const currentPage = pagination.currentPage
    const itemsPerPage = pagination.itemsPerPage
    const total = pagination.total

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, total);
    const showingText = `Showing ${startItem}-${endItem} of ${total}`;
    const totalPagination = Math.round(total / itemsPerPage)

    return (
        <>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        {columnName && (
                            <tr>
                                {columnName.map((c) => (
                                    <th scope="col" className="px-6 py-3" key={c.id}>
                                        {c.name}
                                    </th>
                                ))}
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {datas && (
                            datas.map((data, index) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={data.id}>

                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {index + 1}
                                    </td>

                                    {Object.entries(data).map(([key, value]) => (

                                        key !== "id" && (
                                            <td
                                                key={key}
                                                className="px-6 py-4 text-gray-500 dark:text-gray-400"
                                            >
                                                {key.includes('date') || key.includes('Date')
                                                    ? new Date(value as string).toLocaleDateString()
                                                    : String(value)}
                                            </td>
                                        )
                                    ))}

                                    <td className="flex items-center px-6 py-4">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => onEdit && onEdit(data.id)}>Edit</a>
                                        <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3" onClick={() => onDelete && onDelete(data.id)}>Remove</a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                    <span className="font-semibold text-gray-900 dark:text-gray-400">
                        {showingText}
                    </span>
                </span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={() => currentPage > 1 && onSelectPagination && onSelectPagination(currentPage - 1)}>Previous</a>
                    </li>

                    {total && (
                        Array.from({ length: totalPagination }).map((_, index) => (
                            <li key={index}>
                                {index + 1 === currentPage ? (
                                    <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-red-700 dark:text-white"
                                        onClick={() => onSelectPagination && onSelectPagination(index + 1)}>{index + 1}</a>
                                ) : (
                                    <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        onClick={() => onSelectPagination && onSelectPagination(index + 1)}>{index + 1}</a>
                                )}
                            </li>
                        ))
                    )}

                    <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={() => currentPage < totalPagination && onSelectPagination && onSelectPagination(currentPage + 1)}>Next</a>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Table;
