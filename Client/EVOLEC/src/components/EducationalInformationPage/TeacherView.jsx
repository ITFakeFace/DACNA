import './TeacherView.css';

const TeacherView = ({ teacherName, description, img, side, className }) => {
  if (side == 'left')
    return (
      <div className={`${className}`}></div>
    )
  else
    return (
      <div className={`${className}`}></div>
    )
}

export default TeacherView;