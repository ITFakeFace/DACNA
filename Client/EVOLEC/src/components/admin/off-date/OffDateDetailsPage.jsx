import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../../services/APIService";
import { Button } from "primereact/button";
import { Group, Title } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const OffDateDetailsPage = () => {
  let emptyOffDate = {
    id: null,
    name: '',
    fromDate: new Date(), // yyyy-MM-dd
    toDate: new Date(),   // yyyy-MM-dd
    status: 1,
  }
  const { id } = useParams();
  const [offDate, setOffDate] = useState(emptyOffDate);
  const navigate = useNavigate();
  const fetchOffDate = async () => {
    try {
      var res = await getRequest(`/OffDate/${id}`);
      if (res.status) {
        const data = res.data;
        setOffDate(data);
        console.log("Res: " + JSON.stringify(res));
      }
      console.log("Fetch OffDates");
    } catch (ex) {
      console.log("Cannot fetch data: " + ex);
    }
  }
  useEffect(() => {
    fetchOffDate();
    if (offDate) {
      console.log("offDate updated:", offDate);
    }
  }, [])
  return (
    <div className="container m-3">
      <div className="row">
        <Button
          className='!bg-transparent !text-black !border-0'
          size='xl'
          p='xs'
          onClick={() => navigate('/admin/off-dates')}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className='font-bold text-2xl ml-3'>
            Back
          </span>
        </Button>

      </div>
      <div className="row">
        <Title size='xl' mt={30}>Off Date's Inforation</Title>
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Reason for Leave :</div>
            <div className="w-3/4">{offDate.name}</div>
          </div>

          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Status :</div>
            <div className="w-3/4">{offDate.status == 1
              ? <Button severity='success'>Approved</Button>
              : <Button severity="danger">Not Approved</Button>}
            </div>
          </div>
        </Group>
      </div>

      <div className="row">
        <Title size='xl' mt={50}>Off Date's Affected Class</Title>
        <Group>

        </Group>
      </div>
    </div>
  )
}

export default OffDateDetailsPage;