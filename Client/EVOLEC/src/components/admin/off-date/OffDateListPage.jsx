import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../../services/APIService";
import { Calendar } from "primereact/calendar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";

const OffDateListPage = () => {
  let emptyOffDate = {
    id: null,
    name: '',
    fromDate: new Date(), // yyyy-MM-dd
    toDate: new Date(),   // yyyy-MM-dd
    status: 1,
  };
  const statuses = [
    { name: 'Inactive', value: 0, severity: 'danger' },
    { name: 'Active', value: 1, severity: 'success' },
  ]
  const [offDate, setOffDate] = useState(emptyOffDate);
  const [offDates, setOffDates] = useState(null);
  const [selectedOffDates, setSelectedOffDates] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [offDateDialog, setOffDateDialog] = useState(false);
  const [deleteOffDateDialog, setDeleteOffDateDialog] = useState(false);
  const [deleteOffDatesDialog, setDeleteOffDatesDialog] = useState(false);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const toast = useRef(null);
  const dt = useRef(null);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      fromDate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
      toDate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    });
    setGlobalFilterValue('');
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const clearFilter = () => {
    initFilters();
  };
  const formatDate = (value) => {
    const date = new Date(value); // Chuyển về Date
    if (isNaN(date)) return ''; // Nếu không hợp lệ, trả về chuỗi rỗng
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _offDate = { ...offDate };

    _offDate[`${name}`] = val;

    setOffDate(_offDate);
  };
  const onInputFromDateChange = (e) => {
    const val = (e.target && e.target.value) || '';
    let _offDate = { ...offDate };

    _offDate.fromDate = val;

    if (val > _offDate.toDate) {
      _offDate.toDate = val;
    }

    setOffDate(_offDate);
  };
  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < offDates.length; i++) {
      if (offDates[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const createOffDate = async () => {
    const { id, ...dto } = offDate; // Bỏ id
    console.log(JSON.stringify(dto));
    // Convert to Date object if not already
    const fromDate = new Date(dto.fromDate);
    const toDate = new Date(dto.toDate);

    // Format to 'yyyy-MM-dd'
    dto.fromDate = fromDate.toISOString().split('T')[0];
    dto.toDate = toDate.toISOString().split('T')[0];
    const res = await postRequest(`/OffDate`, dto); // POST
    if (res.status) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Off Date Created',
        life: 3000,
      });
      console.log(JSON.stringify(res));
      return res;
    }
    return null;
  };
  const updateOffDate = async () => {
    const { id, ...dto } = offDate;
    // Convert to Date object if not already
    const fromDate = new Date(dto.fromDate);
    const toDate = new Date(dto.toDate);

    // Format to 'yyyy-MM-dd'
    dto.fromDate = fromDate.toISOString().split('T')[0];
    dto.toDate = toDate.toISOString().split('T')[0];
    const res = await putRequest(`/OffDate/${offDate.id}`, dto); // PUT
    if (res.status) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Off Date Updated',
        life: 3000,
      });
      return res;
    }
    return null;
  };
  const deleteOffDate = async () => {
    const res = await deleteRequest(`/OffDate/${offDate.id}`); // POST
    if (res.status && res.status == true) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Off Date Deleted',
        life: 3000,
      });
      console.log(JSON.stringify(res));
      return res;
    }
    return null;
  }

  const fetchOffDates = async () => {
    try {
      var res = await getRequest(`/OffDate`);
      if (res.status) {
        const data = res.data;
        setOffDates(data);
      }
      console.log("Fetch OffDates");
    } catch (ex) {
      console.log("Cannot fetch data");
    }
  };
  const saveOffDate = async () => {
    setSubmitted(true);
    // validation
    if (offDate.name.trim()) {

      // update list
      let _offDates = [...offDates];
      let _offDate = { ...offDate };

      try {
        if (offDate.id) {
          // update
          console.log("Updating Off Date");
          const index = findIndexById(offDate.id);
          var res = updateOffDate();
          console.log("Updated Off Date");
          if (res) {
            _offDates[index] = _offDate;
          }
        } else {
          // create
          console.log("Saving Off Date");
          var res = await createOffDate();
          if (res) {
            await fetchOffDates();
            console.log("Test Save Fetch:" + JSON.stringify(offDates));
            _offDates.push(res.data);
          }
        }
      } catch (ex) {

      }

      setOffDates(_offDates);
      setOffDateDialog(false);
      setOffDate(emptyOffDate);
    }
  }
  useEffect(() => {
    fetchOffDates();
    initFilters();
    console.log(JSON.stringify(offDates));
  }, []);
  const openNew = () => {
    setOffDate(emptyOffDate);
    setSubmitted(false);
    setOffDateDialog(true);
  }
  const hideDialog = () => {
    setSubmitted(false);
    setOffDateDialog(false);
  }
  const editOffDate = (offDate) => {
    setOffDate({ ...offDate });
    setOffDateDialog(true);
  };
  const confirmDeleteOffDate = (offDate) => {
    setOffDate(offDate);
    setDeleteOffDateDialog(true);
  };
  const deleteOffDateClick = () => {
    let _offDates = offDates.filter((val) => val.id !== offDate.id);
    var res = deleteOffDate();
    if (res) {
      setOffDates(_offDates);
      setDeleteOffDateDialog(false);
      setOffDateForm(emptyOffDate);
    }
  };

  const offDateDialogFooterTemplate = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveOffDate} />
    </React.Fragment>
  );
  const confirmDeleteSelected = () => {

  };
  const hideDeleteOffDateDialog = () => {
    setDeleteOffDateDialog(false);
  };
  const hideDeleteOffDatesDialog = () => {
    setDeleteOffDatesDialog(false);
  };
  const deleteSelectedOffDates = () => {
    let _offDates = offDates.filter((val) => !selectedOffDates.includes(val));
    setOffDates(_offDates);
    setDeleteOffDatesDialog(false);
    setSelectedOffDates(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Off Dates Deleted',
      life: 3000,
    });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedOffDates || !selectedOffDates.length} />
      </div>
    );
  }

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="" icon="pi pi-sync" severity="primary" onClick={fetchOffDates} />
      </div>
    )
  }
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search ..." />
      </IconField>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    console.log(JSON.stringify(rowData));
    return (
      <React.Fragment>
        <Button
          icon="pi pi-info-circle"
          rounded
          outlined
          className="mr-2"
          onClick={() => navigate(`/admin/off-dates/${rowData.id}`)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editOffDate(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteOffDate(rowData)}
        />
      </React.Fragment>
    );
  }

  const fromDateBodyTemplate = (rowData) => {
    return formatDate(rowData.fromDate);
  };

  const fromDateFilterTemplate = (options) => {
    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yyyy" placeholder="dd/mm/yyyy" mask="99/99/9999" />;
  };

  const toDateBodyTemplate = (rowData) => {
    return formatDate(rowData.toDate);
  };

  const toDateFilterTemplate = (options) => {
    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yyyy" placeholder="dd/mm/yyyy" mask="99/99/9999" />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Button label={statuses[rowData.status].name} severity={statuses[rowData.status].severity} />
    )
  }
  const deleteOffDateDialogFooterTemplate = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteOffDateDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteOffDateClick}
      />
    </React.Fragment>
  );
  const deleteOffDatesDialogFooterTemplate = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteOffDatesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedOffDates}
      />
    </React.Fragment>
  );


  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt}
          value={offDates}
          paginator
          showGridlines
          rows={10}
          selection={selectedOffDates}
          onSelectionChange={(e) => setSelectedOffDates(e.value)}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          dataKey="id"
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dates"
          globalFilterFields={['name', 'fromDate', 'toDate', 'status']}
          header={header}
        >
          <Column selectionMode="single" exportable={false}></Column>
          <Column field="id" header="Id" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="fromDate" header="From Date" sortable filterField="fromDate" dataType="date" style={{ minWidth: '12rem' }} body={fromDateBodyTemplate}
            filter filterElement={fromDateFilterTemplate}
            filterFunction={(value, filter) => {
              if (!filter) return true;
              const rowDate = new Date(value);     // value là string như "2024-05-22"
              const filterDate = new Date(filter); // filter là Date từ Calendar
              return (
                rowDate.getFullYear() === filterDate.getFullYear() &&
                rowDate.getMonth() === filterDate.getMonth() &&
                rowDate.getDate() === filterDate.getDate()
              );
            }}
          />
          <Column field="toDate" header="To Date" sortable filterField="toDate" dataType="date" style={{ minWidth: '12rem' }} body={toDateBodyTemplate}
            filter filterElement={toDateFilterTemplate}
            filterFunction={(value, filter) => {
              if (!filter) return true;
              const rowDate = new Date(value);     // value là string như "2024-05-22"
              const filterDate = new Date(filter); // filter là Date từ Calendar
              return (
                rowDate.getFullYear() === filterDate.getFullYear() &&
                rowDate.getMonth() === filterDate.getMonth() &&
                rowDate.getDate() === filterDate.getDate()
              );
            }}
          />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={offDateDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Off Date Details" modal className="p-fluid" footer={offDateDialogFooterTemplate} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Name (Reason)
          </label>
          <InputText id="name" value={offDate.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={submitted && !offDate.name ? 'p-invalid' : ''} />
          {submitted && !offDate.name && <small className="p-error">Name is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="fromDate" className="font-bold">
            From Date
          </label>
          <Calendar id="fromDate" value={offDate.fromDate} onChange={(e) => onInputFromDateChange(e)} dateFormat="dd/mm/yy" />
          {submitted && offDate.fromDate > offDate.toDate && <small className="p-error">From Date must be before To Day.</small>}
        </div>
        <div className="field">
          <label htmlFor="toDate" className="font-bold">
            To Date
          </label>
          <Calendar id="toDate" value={offDate.toDate} onChange={(e) => onInputChange(e, 'toDate')} dateFormat="dd/mm/yy" />
          {submitted && offDate.toDate > offDate.toDate && <small className="p-error">From Date must be before To Day.</small>}
        </div>
        <div className="field">
          <label htmlFor="status" className="font-bold">
            To Date
          </label>
          <Dropdown id="status"
            value={offDate.status}
            onChange={(e) => setSelectedCity(e.value)}
            options={statuses}
            optionLabel="name"
            placeholder="Select status"
            className="w-full md:w-14rem"
          />
          {submitted && !offDate.status && <small className="p-error">Please select status</small>}
        </div>
      </Dialog>

      <Dialog visible={deleteOffDateDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteOffDateDialogFooterTemplate} onHide={hideDeleteOffDateDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {offDate && (
            <span>
              Are you sure you want to delete <b>{offDate.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteOffDatesDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirm"
        modal
        footer={deleteOffDatesDialogFooterTemplate}
        onHide={hideDeleteOffDatesDialog}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {offDate && <span>Are you sure you want to delete the selected off dates?</span>}
        </div>
      </Dialog>
    </div>
  )
}

export default OffDateListPage;