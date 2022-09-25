/* eslint-disable */
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  useMediaQuery,
  Button,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination, SortingState } from 'react-table';
// import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';

// project import
// import CustomerView from 'sections/apps/customer/CustomerView';
// import AddCustomer from 'sections/apps/customer/AddCustomer';
import { AvatarCustom } from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';
import {
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection,
  CustomPagination
} from 'components/third-party/ReactTable';
import customerService from 'services/customerService';
import { enums } from 'utils/EnumUtility';
import { US_DATE_TIME_FORMAT } from 'utils/constants/dateConstants';
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';

const sortByInitialState = { field: 'createdAt', dir: 'desc' };

// ==============================|| REACT TABLE ||============================== //

function ReactTable({
  columns,
  data,
  getHeaderProps,
  renderRowSubComponent,
  handleAdd,
  totalCount,
  getCustomers,
  pageLength,
  pageNumber,
  sort,
  handleSortChange
}) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  // const sortBy = { id: sortByInitialState.field, desc: sortByInitialState.dir === 'desc' ? true : false };
  // const sortBy = { id: 'createdAt', desc: true };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    allColumns,
    visibleColumns,
    rows,
    // @ts-ignore
    page,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    // @ts-ignore
    preGlobalFilteredRows,
    // @ts-ignore
    setGlobalFilter,
    // @ts-ignore
    setSortBy
    // onSortingChange: setSorting,
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      filterTypes,
      // @ts-ignore
      initialState: {
        pageIndex: 0,
        pageSize: pageLength ? pageLength : pageSize,
        sortBy: [{ id: sort.field, desc: sort.dir === 'desc' ? true : false }]
      }
      // manualSorting: true,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  return (
    <>
      {/* <TableRowSelection selected={Object.keys(selectedRowIds).length} /> */}
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ p: 3, pb: 0 }}
        >
          {/* <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          /> */}
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            <SortingSelect sortBy={sort.field} setSortBy={setSortBy} allColumns={allColumns} />
            {/* <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add Customer
            </Button> */}
          </Stack>
        </Stack>

        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    key={index}
                    {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}
                    onClick={() => handleSortChange(column)}
                  >
                    <HeaderSort column={column} handleSortChange={handleSortChange} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit'
                    }}
                  >
                    {row.cells.map((cell, index) => (
                      <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                {/* <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} /> */}
                <CustomPagination
                  gotoPage={gotoPage}
                  rows={rows}
                  totalCount={totalCount}
                  setPageSize={setPageSize}
                  pageSize={pageLength ? pageLength : pageSize}
                  pageIndex={pageNumber ? pageNumber - 1 : pageIndex}
                  getCustomers={getCustomers}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  renderRowSubComponent: PropTypes.any,
  totalCount: PropTypes.number,
  getCustomers: PropTypes.func
};

// ==============================|| CUSTOMER - LIST VIEW ||============================== //

const CellCustomerDetails = ({ row }) => {
  const { values } = row;

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <AvatarCustom avatarColor={row.original.avatarColor} fullName={values.fullName} size={32} />
      <Stack spacing={0}>
        <Typography variant="subtitle1">{`${values.fullName}`}</Typography>
        <Typography variant="caption" color="textSecondary">
          {row.original.email}
        </Typography>
      </Stack>
    </Stack>
  );
};

CellCustomerDetails.propTypes = {
  row: PropTypes.object
};

const CellActions = ({ row }) => {
  const theme = useTheme();
  const collapseIcon = row.isExpanded ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      <Tooltip title="View">
        <IconButton
          color="secondary"
          onClick={(e) => {
            e.stopPropagation();
            row.toggleRowExpanded();
          }}
        >
          {collapseIcon}
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            // setCustomer(row.values);
            // handleAdd();
          }}
        >
          <EditTwoTone twoToneColor={theme.palette.primary.main} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DeleteTwoTone twoToneColor={theme.palette.error.main} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

CellActions.propTypes = {
  row: PropTypes.object
};

const CustomersPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState(sortByInitialState);
  const [pageNumber, setPageNumber] = useState(1);
  const [customersTotalCount, setCustomersTotalCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomerToDelete, setSelectedCustomerToDelete] = useState('');

  const [customer, setCustomer] = useState(null);
  const [add, setAdd] = useState(false);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const getCustomers = async (pageNumber = 1, pageSize = 5) => {
    setIsLoading(true);

    let data;
    let sortByField;

    if (sortBy.field == 'fullName') {
      sortByField = 'firstName';
    } else if (sortBy.field == 'status') {
      sortByField = 'processStatus';
    } else {
      sortByField = sortBy.field;
    }

    if (user?.roleType === enums?.RoleType?.Broker) {
      data = await customerService.getBrokerCustomers({ pageNumber, pageSize }, [{ field: sortByField, dir: sortBy.dir }]);
    } else if (user?.roleType === enums?.RoleType?.Admin) {
      data = await customerService.getAllCustomers({ pageNumber, pageSize }, [{ field: sortByField, dir: sortBy.dir }]);
    }

    setCustomers(data.items);
    setCustomersTotalCount(data.totalCount);
    setPageSize(pageSize);
    setPageNumber(pageNumber);
    setIsLoading(false);
  };

  const handleSortChange = (column) => {
    column.toggleSortBy();
    setSortBy({ field: column.id, dir: !column.isSortedDesc ? 'desc' : 'asc' });
  };

  const handleDeleteModalOpen = (userId) => {
    setSelectedCustomerToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedCustomerToDelete('');
    setIsDeleteModalOpen(false);
  };

  const handleDeleteModalAgree = async () => {
    setIsLoading(true);
    const response = await customerService.deleteCustomer({ userId: selectedCustomerToDelete });

    dispatch(
      openSnackbar({
        open: true,
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        message: response.success ? 'Successfully customer deletion' : 'Customer deletion failed',
        variant: 'alert',
        alert: {
          color: response.success ? 'success' : 'error'
        },
        close: false
      })
    );
    setSelectedCustomerToDelete('');
    setIsDeleteModalOpen(false);

    if (response.success) {
      getCustomers();
    }
  };

  useEffect(() => {
    getCustomers();
  }, [sortBy]);

  const columns = useMemo(
    () => {
      const result = [
        // {
        //   title: 'Row Selection',
        //   // eslint-disable-next-line
        //   Header: ({ getToggleAllPageRowsSelectedProps }) => <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />,
        //   accessor: 'selection',
        //   // eslint-disable-next-line
        //   Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        //   disableSortBy: true
        // },
        // {
        //   Header: '#',
        //   accessor: 'id',
        //   className: 'cell-center'
        // },
        {
          Header: 'Customer',
          accessor: 'fullName',
          Cell: CellCustomerDetails
        },
        // {
        //   Header: 'Avatar',
        //   accessor: 'avatarColor',
        //   disableSortBy: true
        // },
        {
          Header: 'Registration Date',
          accessor: 'createdAt',
          // sortType: handleSortChange,
          // eslint-disable-next-line
          Cell: ({ value }) => <div>{moment(value).format(US_DATE_TIME_FORMAT)}</div>
        },
        {
          Header: 'Contact',
          accessor: 'mobilePhoneNumber',
          // eslint-disable-next-line
          Cell: ({ value }) => (
            <a href={`tel:+1${value}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              <NumberFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={value} />
            </a>
          )
        },
        {
          Header: 'Location',
          accessor: 'city',
          // className: 'cell-right',
          // eslint-disable-next-line
          Cell: ({ row }) => (
            <Box
            // sx={{
            //   display: 'flex',
            //   alignItems: 'center',
            //   justifyContent: 'center',
            //   height: '32px',
            //   width: '32px',
            //   bgcolor: row.original.avatarColor,
            //   color: '#fff',
            //   borderRadius: '50%',
            //   fontWeight: 700,
            //   fontSize: 10
            // }}
            >
              {`${row.original.city}, ${row.original.region}`}
            </Box>
          )
        },
        {
          Header: 'Amount Requested',
          accessor: 'fundingAmountRequested',
          // className: 'cell-right',
          // eslint-disable-next-line
          Cell: ({ value }) => <NumberFormat value={value} displayType="text" thousandSeparator prefix="$" />
        },
        {
          Header: 'Status',
          accessor: 'status',
          // eslint-disable-next-line
          Cell: ({ row }) => {
            switch (row.original.processStatus) {
              case enums?.ProcessStatus.Registration:
                return <Chip color="secondary" label="REGISTERED" size="small" variant="light" />;
              case enums?.ProcessStatus.Authentication:
                return <Chip color="primary" label="AUTHENTICATED" size="small" variant="light" />;
              case enums?.ProcessStatus.CreditApproved:
                return <Chip color="success" label="CREDIT APPROVED" size="small" variant="light" />;
              case enums?.ProcessStatus.CreditFreeze:
                return <Chip color="warning" label="CREDIT FREEZE" size="small" variant="light" />;
              case enums?.ProcessStatus.CreditDecline:
                return <Chip color="error" label="CREDIT DECLINED" size="small" variant="light" />;
              default:
                return <Chip color="primary" label="NONE" size="small" variant="light" />;
            }
          }
        },
        {
          Header: 'Actions',
          className: 'cell-center',
          disableSortBy: true,
          // eslint-disable-next-line
          Cell: ({ row }) => {
            const theme = useTheme();
            // eslint-disable-next-line
            const { values, isExpanded, toggleRowExpanded } = row;
            const collapseIcon = isExpanded ? (
              <CloseOutlined style={{ color: theme.palette.error.main }} />
            ) : (
              <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
            );
            return (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                <Tooltip title="View">
                  <IconButton
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      // toggleRowExpanded();
                    }}
                  >
                    {collapseIcon}
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      // setCustomer(values);
                      // handleAdd();
                    }}
                  >
                    <EditTwoTone twoToneColor={theme.palette.primary.main} />
                  </IconButton>
                </Tooltip> */}
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => handleDeleteModalOpen(row.original.userId)}>
                    <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          }
        }
      ];

      if (user?.roleType === enums?.RoleType?.Admin) {
        const brokerColumn = {
          Header: 'Broker',
          accessor: 'brokerCompanyName',
          // className: 'cell-right',
          // eslint-disable-next-line
          Cell: ({ value }) => <div>{value}</div>
        };
        result.splice(1, 0, brokerColumn);
      }

      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  // const renderRowSubComponent = useCallback(({ row }) => <CustomerView data={data[row.id]} />, [data]);

  return (
    <>
      <MainCard content={false}>
        <ScrollX>
          {!isLoading ? (
            <ReactTable
              columns={columns}
              data={customers}
              handleAdd={handleAdd}
              getHeaderProps={(column) => column.getSortByToggleProps()}
              totalCount={customersTotalCount}
              pageLength={pageSize}
              pageNumber={pageNumber}
              sort={sortBy}
              getCustomers={getCustomers}
              handleSortChange={handleSortChange}
              // renderRowSubComponent={renderRowSubComponent}
            />
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px' }}>
              <CircularProgress color="primary" />
            </Box>
          )}
        </ScrollX>

        {/* add customer dialog */}
        {/* <Dialog maxWidth="sm" fullWidth onClose={handleAdd} open={add} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        {add && <AddCustomer customer={customer} onCancel={handleAdd} />}
      </Dialog> */}
      </MainCard>
      <Dialog fullScreen={fullScreen} open={isDeleteModalOpen} onClose={handleDeleteModalClose} aria-labelledby="responsive-dialog-title">
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle id="responsive-dialog-title">This action will delete the customer from PushFi and Enfortra systems</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete the customer?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteModalClose}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDeleteModalAgree} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default CustomersPage;
