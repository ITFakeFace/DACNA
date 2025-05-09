import './HomePageIntroBox.css';
import TeacherImg2 from "../../assets/homepage/Teacher2.png";

const HomePageIntroBox = () => {
  return (
    <div className="flex w-full justtify-between intro-box">
      <div className="w-1/2 intro-title-box relative">
        <div className="intro-left-top-corner"></div>
        <span className="intro-title">New Way To <br />Learn English </span><br />
        <span className="lng-box">Language</span>
        <div className="intro-right-bottom-corner"></div>
      </div>
      <div className="w-1/2 teacher-img-box">
        <img src={TeacherImg2} className="teacher-img" />
        <div className="teacher-img-bg"></div>
      </div>
    </div>
  )
}

export default HomePageIntroBox;