import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import Footer from './Footer';
import Menu from './Navbar';
import state from "../../Json/State.json";
import VendorApi from '../../Apis/VendorApi';
function isValidName(name) {
    const nameRegex = /^[A-Za-z ]+$/;
    return nameRegex.test(name);
}
function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidTotalTicket(totalTicket) {
    return (Number.isInteger(parseInt(totalTicket)) && parseInt(totalTicket) >= 1);
}
function GuestForm() {
    const [data, setData] = useState([]);

    const selectRef = useRef();
    const { id } = useParams();
    const navigate = useNavigate();

    const [formVisible, setFormVisible] = useState(false);
    const [selectVisible, setSelectVisible] = useState(false);
    const [vendor, setVendor] = useState([]);

    const api = useMemo(() => new VendorApi(), []);

    const handleButtonForm = () => {
        setSelectVisible(false);
        setFormVisible(true);
    }

    const handleButtonSelection = () => {
        setSelectVisible(true);
        setFormVisible(false);
        api.ReadData('vendor').then((response) => {
            setVendor(response);
        });
    }

    useEffect(() => {

    }, [vendor]);
    const [formValue, setFormValue] = useState({
        id: id,
        VendorName: '',
        VendorPhone: '',
        VendorEmail: '',
        TicketCount: 0,
        VendorAddress: '',
        VendorAddress_1: '',
        City: '',
        State: '',
        Zip: ''
    });

    const HandleInput = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
        // console.log(formValue);
    }

    const HandleSubmit = (e) => {
        e.preventDefault();
        formValue.status = -1
        api.InsertDate(formValue).then(response => {
            console.log(response);
            if (response && response.id) {
                alert("You have successfully Appoint Vendor 🙏🙏🙏🙏🙏")
                navigate(`/vendor/${id}/${response.id}`);
            }else if (response && response.error) {
                alert(`${response.error}`);
            }else {
                alert("Some error occur 😭😭😭😭😭😭")
            }
        });
        // console.log(formValue);
    }

    const UpdateVendor = (e) => { 
        e.preventDefault();
        api.UpdateData(formValue).then(response => {
            // console.log(response);
            if (response.id !== "") {
                alert("You have successfully Book a Tickets 🙏🙏🙏🙏🙏")
                navigate(`/vendor/${id}/${response.id}`);
            } else {
                alert("Your Tickets is not booked 😭😭😭😭😭😭")
            }
        });
    }

    const fetchData = useCallback(() => {
        api.ReadData(id).then(result => {
            setData(result);
            // console.log(result);
        }).catch(err => {
            console.log(err);
        });
    }, [id, api]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            {/* <Header /> */}
            <Menu />
            <Container className='mb-5'>
                <h2 className='text-center mb-1 text-danger'>
                    Vendor <Badge bg="secondary">Form</Badge>
                </h2>
                {data.length > 0 && (
                    <div>
                        <Card className="border border-info border-3  mb-3  ">
                            <Card.Body>
                                <Row>
                                    <Col><b>Event Name:</b> {data[0].EventName}</Col>
                                    <Col><b>Host Name:</b> {data[0].HostName}</Col>
                                </Row>
                                <Row>
                                    <Col><b>Start Date:</b> {data[0].StartDate}</Col>
                                    <Col><b>End Date:</b> {data[0].EndDate}</Col>
                                </Row>
                                <Row>
                                    <Col><b>Host Contact:</b> {`${data[0].HostEmail} | ${data[0].HostPhone} | ${data[0].EventAddress} ${data[0].EventAddress_1}`}</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <button type="button" className="btn btn-primary mb-3 me-3" onClick={handleButtonForm}>Add Vendor</button>
                        <button type="button" className="btn btn-secondary mb-3" onClick={handleButtonSelection}>Appoint Vendor</button>
                        {formVisible && (
                            <Form method='POST' action='/' onSubmit={HandleSubmit}>
                                <Card className="border border-success border-3">
                                    <Card.Body>
                                        <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridEmail">
                                                <Form.Label>Vendor Name<span style={{color: 'red'}}>*</span></Form.Label>
                                                <Form.Control type="text" placeholder="Enter Your Name" name="VendorName" value={formValue.VendorName} onChange={HandleInput} required pattern="[A-Za-z0-9]+" className={isValidName(formValue.VendorName) ? '' : 'is-invalid'} />
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="formGridPassword">
                                                <Form.Label>Vendor Phone Number<span style={{color: 'red'}}>*</span></Form.Label>
                                                <Form.Control type="tel" placeholder="Enter Your Phone Number" name="VendorPhone" value={formValue.VendorPhone} onChange={HandleInput} pattern="[0-9]{10}" required maxLength={10} className={isValidPhoneNumber(formValue.VendorPhone) ? '' : 'is-invalid'}/>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="formGridEmail">
                                                <Form.Label>Vendor Email ID<span style={{color: 'red'}}>*</span></Form.Label>
                                                <Form.Control type="email" placeholder="Enter Your Email" name="VendorEmail" value={formValue.VendorEmail} onChange={HandleInput} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required className={isValidEmail(formValue.VendorEmail) ? '' : 'is-invalid'} />
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="formGridEmail">
                                                <Form.Label>Number of Tickets<span style={{color: 'red'}}>*</span></Form.Label>
                                                <Form.Control type="number" placeholder="Enter your count" name="TicketCount" value={formValue.TicketCount} onChange={HandleInput} required min={1} className={isValidTotalTicket(formValue.TicketCount) ? '' : 'is-invalid'}/>
                                            </Form.Group>
                                        </Row>

                                        <Form.Group className="mb-3" controlId="formGridAddress1">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type='text' placeholder="1234 Main St" name="VendorAddress" value={formValue.VendorAddress} onChange={HandleInput} />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formGridAddress2">
                                            <Form.Label>Address 2</Form.Label>
                                            <Form.Control type='text' placeholder="Apartment, studio, or floor" name="VendorAddress_1" value={formValue.VendorAddress_1} onChange={HandleInput} />
                                        </Form.Group>

                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="formGridCity">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control type='text' name="City" value={formValue.City} onChange={HandleInput} />
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="formGridState">
                                                <Form.Label>State</Form.Label>
                                                <Form.Select type='text' name="State" value={formValue.State} onChange={HandleInput} ref={selectRef}>
                                                    <option value=''>Choose...</option>
                                                    {state.map(state => (
                                                        <option key={state.value} value={state.name}>
                                                            {state.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="formGridZip">
                                                <Form.Label>Zip</Form.Label>
                                                <Form.Control type='number' name="Zip" value={formValue.Zip} onChange={HandleInput} />
                                            </Form.Group>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <div className="text-center mt-3">
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        )}
                        <div>
                            {selectVisible && (
                                <form method='POST' action='/' onSubmit={UpdateVendor}>
                                    <div className="form-group">
                                        <label htmlFor="vendorSelect">Select Vendor</label>
                                        <select className="form-control" id="vendorSelect" name='VendorName' value={formValue.VendorName} onChange={HandleInput} ref={selectRef}>
                                            <option value="">Choose..</option>
                                            {vendor.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    {v.name}
                                                </option>
                                            ))}
                                        </select>
                                        <Form.Group as={Col} controlId="formGridEmail">
                                            <Form.Label>Number of Tickets:</Form.Label>
                                            <Form.Control type="number" placeholder="Enter your count" name="TicketCount" value={formValue.TicketCount} onChange={HandleInput} />
                                        </Form.Group>
                                    </div>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </form>
                            )}
                        </div>


                    </div>
                )}
            </Container>
            <Footer />
        </>

    );
}

export default GuestForm;
