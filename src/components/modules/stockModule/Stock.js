import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaBook } from "react-icons/fa";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PlusSignComponent from "../../../share/PlusSignComponent";
import CrossMarkComponent from "../../../share/CrossMarkComponent";
import LogisticsStock from "./LogisticsStock";
import { addStockData, getStockData, getStockDataByItemId, getStockDataByStockId, updateStockData } from "../../../services/stockService";
import { useNavigate, useParams } from 'react-router-dom';
import { getStockItemsByStockId } from "../../../services/stockItemsDetailServices";
import DeleteEditButtonStockItems from "./DeleteEditButtonStockItems";
import StockItemsModal from "./StockItemsModal";


function Stock() {

    const customStyles = {
        content: {
            top: '35%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            width: '60%',
            transform: 'translate(-40%, -10%)',
        },
    }
    const initialValue = {

        "stockId": "",
        "toBranch": "",
        "fromBranch": "",
        "category": "",
        "toWarehouse": "",
        "fromWarehouse": "",
        "requestDate": "",
        "requestNo": "",
        "remark": "",
        "instruction": "",
        "fileName": ""

    }

    var logictisObj = {
        "destination": "",
        "shippingMode": "",
        "shippingCompany": "",
        "shippingTrackingNo": "",
        "shippingDate": "",
        "shippingCharges": 0,
        "vesselNo": "",
        "chargeType": "",
        "documentThrough": "",
        "noOfPack": "",
        "weight": "",
        "distance": "",
        "eWayInvoiceNo": "",
        "eWayInvoiceDate": "",
        "irnNo": "",
        "irnCancelDate": "",
        "irnCancelReason": ""
    }

    const [formValues, setFormValue] = useState(initialValue)
    const [stockItemsData, setStockItemsData] = useState([])
    const { stockId } = useParams()
    const [isUpdate, setIsUpdate] = useState(false)
    const [isGetLogisticData, setIsLogisticData] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const navigate = useNavigate()



    useEffect(() => {

        if (stockId > 0) {
            getStockDataByStockId(stockId).then(res => {
                setFormValue(res.data[0])
            })
            setIsUpdate(true)
            getStockItemsData(stockId)
        }


    }, [])

    const getStockItemsData = (stockId) => {
        getStockItemsByStockId(stockId).then(res => {
            console.log(res.data)
            setStockItemsData(res.data)
        })
    }
    const handleChange = (e, setFieldValue) => {

        const { name, value } = e.target
        console.log(name)
        console.log(value)
        setFormValue({ ...formValues, [name]: value })

        setFieldValue([name], value)
    }

    const handleChange1 = (e) => {

        const { name, value } = e.target
        console.log(name)
        console.log(value)
        setFormValue({ ...formValues, [name]: value })
    }

    //callback function
    const getDataFromLogistic = (setLogisticData) => {

        logictisObj = { ...setLogisticData }
        setIsLogisticData(true)
        console.log(logictisObj)


    }

    const handleStockItemsData = () => {
        getStockItemsData(stockId)
    }

    const openModalForEditData = (id) => {
        setIsOpenModal(true)
    }

    //callback from modal from close modal
    const closeItemModal = (close) => {
        // alert(close)
        setIsOpenModal(close)


    }

    const handleSubmit = () => {

        let objData = {}
        if (isGetLogisticData) {
            objData = { ...formValues, ...logictisObj }
        }
        else {
            objData = { ...formValues }
        }
        console.log(objData)
        if (isUpdate) {
            updateStockData(objData, formValues.id)
        }
        else
            addStockData(objData)



    }
    const validationSchema = Yup.object({

        toBranch: Yup.string().required("required"),
        fromBranch: Yup.string().required("required"),
        category: Yup.string().required("required"),
        toWarehouse: Yup.string().required("required"),
        requestDate: Yup.string().required("required"),
        requestNo: Yup.string().required("required"),

    })



    const columns = [
        {
            headerName: 'S.No', field: '',
            cellRenderer: PlusSignComponent,
        },

        {
            headerName: 'Select Item', field: 'selectItem'
        },
        {
            headerName: 'Description', field: 'description'
        },
        {
            headerName: 'Sub Item', field: 'subItem'
        },
        {
            headerName: 'Pack Unit', field: 'packUnit'
        },
        {
            headerName: 'Pack Quantity', field: 'packQuantity'
        },
        {
            headerName: 'Unit', field: 'unit'
        },
        {
            headerName: 'Quantity', field: 'qty'
        },
        {
            headerName: "Action",
            field: "",
            cellRenderer: DeleteEditButtonStockItems,
            cellRendererParams: {
                funGetInfo: handleStockItemsData,
                openModalForEdit: openModalForEditData,
            }
        }

    ]

    const defaultColDefs = { flex: 1 }

    return (
        <>
            <div className="container mt-3 mb-5">
                <h4 className="text-info w-100 mb-3 text-center border border-2 border-info-subtle">
                    <div className="m-2">
                        <FaBook className="me-2" />
                        Stock Data
                    </div>
                </h4>

                <Formik initialValues={formValues} validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="mt-3">

                            <div className="row">

                                <div className="col-md-6">

                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            Branch <span className="text-danger fw-bold">*</span>
                                        </label>
                                        <div className="col-sm-8  text-danger fs-6">
                                            <Field
                                                as="select"
                                                name="toBranch"
                                                value={formValues.toBranch}
                                                className="form-select form-select-sm"
                                                onChange={e => handleChange(e, setFieldValue)}
                                            >
                                                <option value="">Select</option>
                                                <option value="Branch1">Branch1</option>
                                                <option value="Branch2">Branch2</option>
                                            </Field>
                                            <ErrorMessage name='toBranch' className=" ms-1" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            From Branch  <span className="text-danger fw-bold">*</span>
                                        </label>
                                        <div className="col-sm-8  text-danger fs-6">
                                            <Field
                                                as="select"
                                                name="fromBranch"
                                                value={formValues.fromBranch}
                                                onChange={e => handleChange(e, setFieldValue)}
                                                className="form-select form-select-sm"
                                            >
                                                <option value="">Select</option>
                                                <option value="Branch1">Branch1</option>
                                                <option value="Branch2">Branch2</option>
                                            </Field>
                                            <ErrorMessage name='fromBranch' className="ms-1" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            Category  <span className="text-danger fw-bold">*</span>
                                        </label>
                                        <div className="col-sm-8  text-danger fs-6">
                                            <Field
                                                as="select"
                                                name="category"
                                                value={formValues.category}
                                                onChange={e => handleChange(e, setFieldValue)}
                                                className="form-select form-select-sm"
                                            >
                                                <option value="">Select</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </Field>
                                            <ErrorMessage name='category' className="ms-1" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            Warehouse  <span className="text-danger fw-bold">*</span>
                                        </label>
                                        <div className="col-sm-8  text-danger fs-6">
                                            <Field
                                                as="select"
                                                name="toWarehouse"
                                                value={formValues.toWarehouse}
                                                onChange={e => handleChange(e, setFieldValue)}
                                                className="form-select form-select-sm"
                                            >
                                                <option value="">Select</option>
                                                <option value="Warehouse1">Warehouse1</option>
                                                <option value="Warehouse2">Warehouse2</option>
                                            </Field>
                                            <ErrorMessage name='toWarehouse' className="ms-1" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            From Warehouse  <span className="text-danger fw-bold">*</span>
                                        </label>
                                        <div className="col-sm-8  text-danger fs-6">
                                            <Field
                                                as="select"
                                                name="fromWarehouse"
                                                value={formValues.fromWarehouse}
                                                onChange={e => handleChange(e, setFieldValue)}
                                                className="form-select form-select-sm"
                                            >
                                                <option value="">Select</option>
                                                <option value="Warehouse1">Warehouse1</option>
                                                <option value="Warehouse2">Warehouse2</option>
                                            </Field>
                                            <ErrorMessage name='fromWarehouse' className="ms-1" />
                                        </div>
                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            Request Date  <span className="text-danger fw-bold">*</span>
                                        </label>
                                        <div className="col-sm-8 text-danger fs-6">

                                            <Field type="date" className="form-control form-control-sm"
                                                name="requestDate"
                                                value={formValues.requestDate}
                                                onChange={e => handleChange(e, setFieldValue)}></Field>
                                            <ErrorMessage name='requestDate' className="ms-1" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            Request No.  <span className="text-danger fw-bold">*</span>
                                        </label>
                                        <div className="col-sm-8  text-danger fs-6">
                                            <Field
                                                type="text"
                                                name="requestNo"
                                                value={formValues.requestNo}
                                                onChange={e => handleChange(e, setFieldValue)}
                                                className="form-control form-control-sm"
                                            />
                                            <ErrorMessage name='requestNo' className=" ms-1" />
                                        </div>
                                    </div>


                                </div>

                            </div>
                            <div className="ag-theme-alpine my-3" style={{ height: 300 }}>
                                <AgGridReact
                                    rowData={stockItemsData}
                                    columnDefs={columns}
                                    defaultColDef={defaultColDefs}
                                />
                            </div>

                            <div className="row">
                                <button
                                    type="button"
                                    className="col-sm-2 mt-2 ms-2mb-4 btn btn-info"
                                    data-bs-toggle="modal" data-bs-target="#exampleModal"
                                    onClick={() => setIsOpenModal(true)}
                                >
                                    Add Blank Row
                                </button>
                            </div>

                            <div className="row mt-2">
                                <hr></hr>
                            </div>

                            <div className="row mb-2">

                                <div className="col-md-6">
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            Remark
                                        </label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                name="remark"
                                                value={formValues.remark}
                                                onChange={e => handleChange1(e)}
                                                className="form-control form-control-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label for="formFile" className="col-sm-4 col-form-label">
                                            Attachment
                                        </label>
                                        <input className="col-sm-8  form-control" type="file"
                                            name="fileName"
                                            value={formValues.fileName}
                                            onChange={e => handleChange1(e)}
                                            id="formFile" placeholder="FileName" />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">
                                            Instruction
                                        </label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                name="instruction"
                                                value={formValues.instruction}
                                                onChange={e => handleChange1(e)}
                                                className="form-control form-control-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="row mt-2">
                                <hr></hr>
                            </div>

                            <LogisticsStock id={stockId} sendDataFromLogistics={getDataFromLogistic} />
                            <div className="row">
                                <div className='col-sm-12 text-center'><button type="submit"
                                    class="btn btn-info " id="">Submit</button>
                                </div>
                            </div>
                        </Form>)}
                </Formik>
                {isOpenModal && <StockItemsModal sId={stockId} closemodal={closeItemModal} />}
                {/*  <ReactModal isOpen={isOpenModal}
                    onRequestClose={() => setIsOpenModal(false)}
                    style={customStyles}
                    >
                    <StockItemsModal closeModal={closeItemModal}></StockItemsModal>
                    </ReactModal> */}



            </div>
        </>
    )
}

export default Stock