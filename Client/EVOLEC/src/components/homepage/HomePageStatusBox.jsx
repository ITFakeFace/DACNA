import { faBuilding, faEarthAmericas, faSchool, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './HomePageStatusBox.css';

const HomePageStatusBox = () => {
  return (
    <div className="status-container w-full">
      <div className="status-title-box text-center">
        <span className='title-line1'>
          In all the journey
        </span>
        <span className='title-line2'>
          <span>
            We have achievements
          </span>
        </span>
      </div>
      <div className="status-box w-full flex flex-wrap justify-around mt-20">
        <div className="card w-1/2 md:w-1/4 text-center gap-5">
          <div className="icon">
            <FontAwesomeIcon icon={faUser} size="6x" />
          </div>
          <div className="number">
            <span className='number-content'>1000<span className="plus">+</span></span>
          </div>
          <div className="title">
            <span className='title-content'>Total Students</span>
          </div>
        </div>
        <div className="card w-1/2 md:w-1/4 text-center">
          <div className="icon">
            <FontAwesomeIcon icon={faSchool} size="6x" />
          </div>
          <div className="number">
            <span className='number-content'>100<span className="plus">+</span></span>
          </div>
          <div className="title">
            <span className='title-content'>Total Classes</span>
          </div>
        </div>
        <div className="card w-1/2 md:w-1/4 text-center">
          <div className="icon">
            <FontAwesomeIcon icon={faBuilding} size="6x" />
          </div>
          <div className="number">
            <span className='number-content'>200<span className="plus">+</span></span>
          </div>
          <div className="title">
            <span className='title-content'>Authorized Business</span>
          </div>
        </div>
        <div className="card w-1/2 md:w-1/4 text-center">
          <div className="icon">
            <FontAwesomeIcon icon={faEarthAmericas} size="6x" />
          </div>
          <div className="number">
            <span className='number-content'>40<span className="plus">+</span></span>
          </div>
          <div className="title">
            <span className='title-content'>Authorized Country</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePageStatusBox;