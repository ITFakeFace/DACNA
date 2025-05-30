import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../../services/APIService";

const RoomListPage = () => {
  let emptyRoom = {
    id: null,
    name: '',
    address: '',
    status: null,
  }
  const [room, setRoom] = useState(emptyRoom);
  const [rooms, setRooms] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [roomDialog, setRoomDialog] = useState(false);
  const [deleteRoomDialog, setDeleteRoomDialog] = useState(false);
  const [deleteRoomsDialog, setDeleteRoomsDialog] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const navigate = useNavigate();
  const toast = useRef(null);
  const dt = useRef(null);
  const statuses = [
    { name: 'Deactive', value: 0, severity: 'danger' },
    { name: 'Active', value: 1, severity: 'success' },
    { name: 'Mantain', value: 2, severity: 'warning' },
  ]
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
  const onStatusChange = (e) => {
    let _room = { ...room };

    _room['status'] = e.value;
    setRoom(_room);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _room = { ...room };

    _room[`${name}`] = val;

    setRoom(_room);
  };
  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const createRoom = async () => {
    const { id, ...dto } = room; // Bỏ id
    console.log("Before Create: " + JSON.stringify(dto));

    const res = await postRequest(`/Room`, dto); // POST
    if (res.status) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Room Created',
        life: 3000,
      });
      console.log("After Create: " + JSON.stringify(res));
      return res;
    }
    return null;
  };
  const updateRoom = async () => {
    const { id, ...dto } = room;
    const res = await putRequest(`/Room/${room.id}`, dto); // PUT
    if (res.status) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Room Updated',
        life: 3000,
      });
      return res;
    }
    return null;
  };
  const deleteRoom = async () => {
    const res = await deleteRequest(`/Room/${room.id}`); // POST
    if (res.status && res.status == true) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Room Deleted',
        life: 3000,
      });
      console.log(JSON.stringify(res));
      return res;
    }
    return null;
  }

  const fetchRooms = async () => {
    try {
      var res = await getRequest(`/Room`);
      if (res.status) {
        const data = res.data;
        setRooms(data);
      }
      console.log("Fetch Rooms");
    } catch (ex) {
      console.log("Cannot fetch data");
    }
  };
  const saveRoom = async () => {
    setSubmitted(true);
    // validation
    if (room.name.trim()) {

      // update list
      let _rooms = [...rooms];
      let _room = { ...room };
      try {
        console.log("Saving: " + JSON.stringify(_room));
        if (room.id) {
          // update
          console.log("Updating room");
          const index = findIndexById(room.id);
          var res = updateRoom();
          console.log("Updated room");
          if (res) {
            _rooms[index] = _room;
          }
        } else {
          // create
          console.log("Saving room");
          var res = await createRoom();
          if (res) {
            await fetchRooms();
            console.log("Test Save Fetch:" + JSON.stringify(rooms));
            _rooms.push(res.data);
          }
        }
      } catch (ex) {

      }
      console.log("After Save: " + JSON.stringify(rooms));

      setRooms(_rooms);
      setRoomDialog(false);
      setRoom(emptyRoom);
    }
  }
  useEffect(() => {
    fetchRooms();
    initFilters();
    console.log("Init: " + JSON.stringify(rooms));
  }, []);

  const openNew = () => {
    setRoom(emptyRoom);
    setSubmitted(false);
    setRoomDialog(true);
  }
  const hideDialog = () => {
    setSubmitted(false);
    setRoomDialog(false);
  }
  const editRoom = (room) => {
    let _room = { ...room }
    setRoom(_room);
    setRoomDialog(true);
  };
  const confirmDeleteRoom = (room) => {
    setRoom(room);
    setDeleteRoomDialog(true);
  };
  const deleteRoomClick = () => {
    let _rooms = rooms.filter((val) => val.id !== room.id);
    var res = deleteRoom();
    if (res) {
      setRooms(_rooms);
      setDeleteRoomDialog(false);
      setRoom(emptyRoom);
    }
  };

  const roomDialogFooterTemplate = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveRoom} />
    </React.Fragment>
  );

  const confirmDeleteSelected = () => {

  };
  const hideDeleteRoomDialog = () => {
    setDeleteRoomDialog(false);
  };
  const hideDeleteRoomsDialog = () => {
    setDeleteRoomsDialog(false);
  };
  const deleteSelectedRooms = () => {
    let _rooms = rooms.filter((val) => !selectedRooms.includes(val));
    setRooms(_rooms);
    setDeleteRoomsDialog(false);
    setSelectedRooms(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Rooms Deleted',
      life: 3000,
    });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRooms || !selectedRooms.length} />
      </div>
    );
  }

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="" icon="pi pi-sync" severity="primary" onClick={fetchRooms} />
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
    return (
      <React.Fragment>
        <Button
          icon="pi pi-info-circle"
          rounded
          outlined
          className="mr-2"
          onClick={() => navigate(`/admin/rooms/${rowData.id}`)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editRoom(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteRoom(rowData)}
        />
      </React.Fragment>
    );
  }

  const statusBodyTemplate = (rowData) => {
    console.log("status body:" + JSON.stringify(rowData));
    if ((!rowData || !rowData.status || !statuses[rowData.status]) && rowData.status != 0) {
      return <span>-</span>;
    }

    return (
      <Button
        label={statuses[rowData.status].name}
        severity={statuses[rowData.status].severity}
      />
    );
  };

  const deleteRoomDialogFooterTemplate = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteRoomDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteRoomClick}
      />
    </React.Fragment>
  );
  const deleteRoomsDialogFooterTemplate = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteRoomsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedRooms}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt}
          value={rooms}
          paginator
          showGridlines
          rows={10}
          selection={selectedRooms}
          onSelectionChange={(e) => setSelectedRooms(e.value)}
          dataKey="id"
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rooms"
          header={header}
          globalFilterFields={['name', 'address', 'id', 'status']}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
        >
          <Column selectionMode="single" exportable={false}></Column>
          <Column field="id" header="Id" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="address" header="Address" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={roomDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Room Details" modal className="p-fluid" footer={roomDialogFooterTemplate} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Name (Code)
          </label>
          <InputText id="name" value={room.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={submitted && !room.name ? 'p-invalid' : ''} />
          {submitted && !room.name && <small className="p-error">Name is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="address" className="font-bold">
            Address
          </label>
          <InputText id="address" value={room.address} onChange={(e) => onInputChange(e, 'address')} required autoFocus className={submitted && !room.address ? 'p-invalid' : ''} />
          {submitted && !room.address && <small className="p-error">Address is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="status" className="font-bold">
            Status
          </label>
          <Dropdown id="status"
            value={room.status}
            onChange={(e) => onStatusChange(e)}
            options={statuses}
            optionLabel="name"
            placeholder="Select status"
            className="w-full md:w-14rem"
          />
          {submitted && !room.status && <small className="p-error">Please select status</small>}
        </div>
      </Dialog>

      <Dialog visible={deleteRoomDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteRoomDialogFooterTemplate} onHide={hideDeleteRoomDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {room && (
            <span>
              Are you sure you want to delete <b>{room.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteRoomsDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirm"
        modal
        footer={deleteRoomsDialogFooterTemplate}
        onHide={hideDeleteRoomsDialog}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {room && <span>Are you sure you want to delete the selected rooms?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default RoomListPage;