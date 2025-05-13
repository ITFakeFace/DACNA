import './TeacherView.css';

const TeacherView = ({ teacherName, description, img, side, quote, className }) => {
  if (side == 'left')
    return (
      <div className={`${className} flex flex-wrap items-center justify-around view-container`}>
        <div className='w-1/3 '>
          <img className='block w-full h-auto img-teacher' src={img} />
        </div>
        <div className='w-2/3 p-3.5 pl-5 h-full '>
          <div className='teacher-name w-full'>{teacherName}</div>
          <div className='teacher-description w-full text-wrap'>{description}</div>
          <div className='w-full'>
            - <span className='teacher-quote'>{quote}</span> -
          </div>
        </div>
      </div>
    )
  else
    return (
      <div className={`${className} flex flex-wrap items-center justify-around view-container`}>
        <div className='w-2/3 p-3.5 pl-5 h-full '>
          <div className='teacher-name w-full'>{teacherName}</div>
          <div className='teacher-description w-full text-wrap'>{description}</div>
          <div className='w-full'>
            - <span className='teacher-quote'>{quote}</span> -
          </div>
        </div>
        <div className='w-1/3 '>
          <img className='block w-full h-auto img-teacher' src={img} />
        </div>
      </div>
    )
}

export default TeacherView;