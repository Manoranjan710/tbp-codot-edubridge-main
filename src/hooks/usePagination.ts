import { useState, useMemo } from 'react';

interface UsePaginationProps {
    totalItems: number;
    itemsPerPage?: number;
    initialPage?: number;
}

export function usePagination({
    totalItems,
    itemsPerPage = 20,
    initialPage = 1
}: UsePaginationProps) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginationData = useMemo(() => ({
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        itemsPerPage
    }), [currentPage, totalPages, startIndex, endIndex, itemsPerPage]);

    const goToPage = (page: number) => {
        const validPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(validPage);
    };

    const nextPage = () => {
        goToPage(currentPage + 1);
    };

    const previousPage = () => {
        goToPage(currentPage - 1);
    };

    const reset = () => {
        setCurrentPage(1);
    };

    return {
        ...paginationData,
        goToPage,
        nextPage,
        previousPage,
        reset
    };
}
