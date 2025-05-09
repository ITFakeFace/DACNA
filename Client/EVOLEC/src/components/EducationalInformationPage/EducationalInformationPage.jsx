import './EducationalInformationPage.css'
import TeacherView from './TeacherView';

const EducationalInformationPage = () => {
  return (
    <div className='container'>
      <div className='main-title my-10'>
        <div className='text-[1.25rem] text-center'>
          <span>Our services provide the highest quality of education</span> <br />
          <span>Come to EVOLEC, you will have an oppoturnity to learn with our proffessional teachers</span>
        </div>
        <div className='flex flex-wrap px-10 py-20'>
          <TeacherView
            teacherName="Jonathan Sereth"
          />
        </div>
      </div>
    </div>
  )
}

export default EducationalInformationPage;