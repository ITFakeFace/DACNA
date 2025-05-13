import './EducationalInformationPage.css'
import TeacherView from './TeacherView';
import ImgTeacher1 from '../../assets/educational-information-page/TeacherProfile1.jpg';
import ImgTeacher2 from '../../assets/educational-information-page/TeacherProfile2.jpg';
import ImgTeacher3 from '../../assets/educational-information-page/TeacherProfile3.jpg';
const EducationalInformationPage = () => {
  return (
    <div className='container'>
      <div className='main-title my-10'>
        <div className='text-center'>
          <span>Our services provide the highest quality of education</span> <br />
          <span>Come to EVOLEC, you will have an oppoturnity to learn with our proffessional teachers</span>
        </div>
        <div className='w-full flex flex-wrap px-10 py-20 items-center justify-around gap-15'>
          <TeacherView
            className={"w-6/7"}
            img={ImgTeacher2}
            side={"right"}
            teacherName="Rosen Emilia"
            description="An talented teacher with over 10 years in educating for over 10+ countries around the world. Mrs.Rosen has become one of the must influence people in social media."
            quote="The fear is not success or failure. It is getting nothing."
          />
          <TeacherView
            className={"w-6/7"}
            img={ImgTeacher1}
            side="left"
            teacherName="Jonathan Sereth"
            description="With more than 15+ years in teaching, Mr.Jonathan have growth 20+ student with excellent result. Half of them have gotten 8.5+ grade in IELTS."
            quote="We will win when we want"
          />
          <TeacherView
            className={"w-6/7"}
            img={ImgTeacher3}
            side={"right"}
            teacherName="William Sophia"
            description="Mrs.William wonderful teacher with excellent lecturing skill. Most of her students have graduated with creative mindset"
            quote="Castle was build from bricks step by step, so does human's mind set"
          />
        </div>
      </div>
    </div>
  )
}

export default EducationalInformationPage;