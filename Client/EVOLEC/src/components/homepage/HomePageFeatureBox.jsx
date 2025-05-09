import FeatureCard from './FeatureCard';
import './HomePageFeatureBox.css';
import DiplomaIcon from '../../assets/homepage/DiplomaIcon.png'
import TargetIcon from '../../assets/homepage/TargetIcon.png'
import EarthIcon from '../../assets/homepage/EarthIcon.png'
const HomePageFeatureBox = () => {
  return (
    <div className="feature-box">
      <div className="feature-title">
        <div className='title-line1'>Our Services</div>
        <div className='title-line2'><span>Provide Features</span></div>
      </div>
      <div className="card-container w-full">
        <FeatureCard
          className="w-1/2 md:w-1/5 card"
          title="Standard Diploma"
          description="We provide a diploma which is vary accepted by multiple internatinal assosiations"
          image={DiplomaIcon}
        />
        <FeatureCard
          className="w-1/2 md:w-1/5 card"
          title="Private Target"
          description="Our teacher have been make a lot of efforts to let their student complete the target"
          image={TargetIcon}
        />
        <FeatureCard
          className="w-1/2 md:w-1/5 card"
          title="Foreign Teacher"
          description="Come to us, you will have oppoturnity to communicate with oversea teacher from around the world"
          image={EarthIcon}
        />
      </div>
    </div>
  )
}

export default HomePageFeatureBox;