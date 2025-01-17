import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const useTableControls = (data, defaultSort = { field: 'id', direction: 'asc' }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 0);
    const [rowsPerPage, setRowsPerPage] = useState(parseInt(searchParams.get('size')) || 10);
    const [sortBy, setSortBy] = useState({
        field: searchParams.get('sortField') || defaultSort.field,
        direction: searchParams.get('sortDir') || defaultSort.direction,
    });
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    const updateSearchParams = useCallback(() => {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('size', rowsPerPage.toString());
        params.set('sortField', sortBy.field);
        params.set('sortDir', sortBy.direction);
        if (searchQuery) params.set('search', searchQuery);
        setSearchParams(params);
    }, [page, rowsPerPage, sortBy, searchQuery, setSearchParams]);

    // Handle page change
    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    // Handle rows per page change
    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    // Handle sort change
    const handleSortChange = useCallback((field) => {
        setSortBy((prev) => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    // Handle filter change
    const handleFilterChange = useCallback((field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
        setPage(0);
    }, []);

    // Handle search
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setPage(0);
    }, []);

    // Process data with current controls
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(query)
                )
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([field, value]) => {
            if (value !== undefined && value !== '') {
                result = result.filter((item) =>
                    String(item[field]).toLowerCase().includes(String(value).toLowerCase())
                );
            }
        });

        // Apply sort
        result.sort((a, b) => {
            const aValue = a[sortBy.field];
            const bValue = b[sortBy.field];
            
            if (aValue === bValue) return 0;
            
            const comparison = aValue < bValue ? -1 : 1;
            return sortBy.direction === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [data, searchQuery, filters, sortBy]);

    // Get paginated data
    const paginatedData = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return processedData.slice(startIndex, startIndex + rowsPerPage);
    }, [processedData, page, rowsPerPage]);

    // Update URL params when controls change
    useCallback(() => {
        updateSearchParams();
    }, [updateSearchParams]);

    return {
        page,
        rowsPerPage,
        sortBy,
        filters,
        searchQuery,
        totalCount: processedData.length,
        data: paginatedData,
        handlePageChange,
        handleRowsPerPageChange,
        handleSortChange,
        handleFilterChange,
        handleSearch,
    };
};

export default useTableControls;
