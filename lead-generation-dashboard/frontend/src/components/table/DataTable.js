import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    TextField,
    Box,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { varFadeInUp } from '../animate/variants/fade';

const defaultRowsPerPage = 10;

const DataTable = ({
    columns = [],
    data = [],
    pagination = false,
    sortable = false,
    filterable = false,
    loading = false,
}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
    const [sortBy, setSortBy] = React.useState({ field: '', direction: 'asc' });
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filters, setFilters] = React.useState({});
    const [showFilters, setShowFilters] = React.useState(false);

    // Reset page when data changes
    React.useEffect(() => {
        setPage(0);
    }, [data]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (field) => {
        if (!sortable) return;
        
        const isAsc = sortBy.field === field && sortBy.direction === 'asc';
        setSortBy({
            field,
            direction: isAsc ? 'desc' : 'asc',
        });
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleFilter = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
        }));
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({});
        setSearchQuery('');
        setPage(0);
    };

    // Apply filters and search
    const filteredData = React.useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        let filtered = [...data];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(row => 
                columns.some(col => {
                    const value = row[col.field];
                    return value && String(value).toLowerCase().includes(query);
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([field, value]) => {
            if (value) {
                filtered = filtered.filter(row => {
                    const rowValue = row[field];
                    return rowValue && String(rowValue).toLowerCase().includes(value.toLowerCase());
                });
            }
        });

        // Apply sorting
        if (sortBy.field) {
            filtered.sort((a, b) => {
                const aValue = a[sortBy.field];
                const bValue = b[sortBy.field];
                
                if (aValue === bValue) return 0;
                if (aValue === undefined || aValue === null) return 1;
                if (bValue === undefined || bValue === null) return -1;

                const comparison = String(aValue).localeCompare(String(bValue));
                return sortBy.direction === 'asc' ? comparison : -comparison;
            });
        }

        return filtered;
    }, [data, columns, searchQuery, filters, sortBy]);

    // Paginate data
    const paginatedData = React.useMemo(() => {
        if (!pagination) return filteredData;
        const start = page * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, page, rowsPerPage, pagination]);

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
        return <div>No columns defined</div>;
    }

    return (
        <motion.div variants={varFadeInUp}>
            <Box sx={{ width: '100%' }}>
                {(filterable || sortable) && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {filterable && (
                            <TextField
                                size="small"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.disabled' }} />,
                                }}
                            />
                        )}
                        {Object.keys(filters).length > 0 && (
                            <Tooltip title="Clear filters">
                                <IconButton onClick={clearFilters} size="small">
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {filterable && (
                            <Tooltip title="Show filters">
                                <IconButton
                                    onClick={() => setShowFilters(!showFilters)}
                                    color={showFilters ? 'primary' : 'default'}
                                    size="small"
                                >
                                    <FilterIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                )}

                {showFilters && (
                    <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {columns.map((column) => (
                            column.filterable && (
                                <TextField
                                    key={column.field}
                                    size="small"
                                    label={column.label}
                                    value={filters[column.field] || ''}
                                    onChange={(e) => handleFilter(column.field, e.target.value)}
                                />
                            )
                        ))}
                    </Box>
                )}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.field}
                                        sortDirection={sortBy.field === column.field ? sortBy.direction : false}
                                    >
                                        {column.sortable && sortable ? (
                                            <TableSortLabel
                                                active={sortBy.field === column.field}
                                                direction={sortBy.field === column.field ? sortBy.direction : 'asc'}
                                                onClick={() => handleSort(column.field)}
                                            >
                                                {column.label}
                                            </TableSortLabel>
                                        ) : (
                                            column.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((row, index) => (
                                    <TableRow key={row.id || index}>
                                        {columns.map((column) => (
                                            <TableCell key={column.field}>
                                                {column.render ? column.render(row) : row[column.field]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {pagination && (
                    <TablePagination
                        component="div"
                        count={filteredData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}
            </Box>
        </motion.div>
    );
};

export default DataTable;
