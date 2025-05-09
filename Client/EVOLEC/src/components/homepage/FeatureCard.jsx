import './FeatureCard.css';
const FeatureCard = ({ className, title, description, image }) => {
  return (
    <div className={`${className} feature-card`}>
      <div className="img-box">
        <img src={image} alt='' />
      </div>
      <div className="title">
        <span className='title-content'>
          {title}
        </span>
      </div>
      <div className="description">
        <span className='description-content'>
          {description}
        </span>
      </div>
    </div>
  );
}

export default FeatureCard;