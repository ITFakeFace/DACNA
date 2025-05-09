import { Anchor } from '@mantine/core';
import './GeneralFooter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faVoicemail } from '@fortawesome/free-solid-svg-icons';

const GeneralFooter = () => {
  return (
    <div className="footer w-full h-full flex">
      <div className='w-1/2 '>
        <div className='footer-title w-full h-[200px] flex text-wrap text-4xl justify-center text-center items-center'>
          <span>
            We really appriciate your visit.<br /> Hope you have a good time.
          </span>
        </div>
        <div className='w-full'>
          <div className='text-wrap text-4xl text-center'>
            <Anchor href="https://facebook.com/" target="_blank" underline="never" className='anchor-style'>
              <FontAwesomeIcon icon={faFacebook} /> <span>Facebook: EVOLEC - EVOLUTION ENGLISH CENTER</span>
            </Anchor>
          </div>
          <div className='text-wrap text-4xl text-center'>
            <Anchor href="https://tiktok.com/" target="_blank" underline="never" className='anchor-style'>
              <FontAwesomeIcon icon={faTiktok} /> <span>Tiktok: EVOLEC - EVOLUTION ENGLISH CENTER</span>
            </Anchor>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex text-wrap text-4xl justify-center items-center">
        <div>
          <div className='footer-info my-5'>
            <FontAwesomeIcon icon={faEnvelope} /> <span>Email: evolution_english_center@evolec.edu.com</span>
          </div>
          <div className='footer-info my-5'>
            <FontAwesomeIcon icon={faPhone} /> <span>Phone Number: +84 0792 8829</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralFooter;