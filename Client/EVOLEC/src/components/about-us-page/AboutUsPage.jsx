import { Timeline } from 'primereact/timeline';
import './AboutUsPage.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightDots, faBuilding, faClock, faEarthAmerica, faEarthAmericas, faHandsHolding, faMaximize } from '@fortawesome/free-solid-svg-icons';

const AboutUsPage = () => {
  const events = [
    {
      status: 'Year 2014: Foundation',
      icon: faHandsHolding,
      color: '#3EE475',
      description: "EVOLEC English Center was officially established with the mission to provide high-quality English language education to students of all ages. In its founding year, EVOLEC focused on designing a practical curriculum aligned with international standards, building a core team of passionate educators, and laying the groundwork for a student-centered learning environment.",
    },
    {
      status: 'Year 2015: Expandition',
      icon: faMaximize,
      color: '#673AB7',
      description: "Within just one year, EVOLEC made significant strides, expanding its reach to over 100 students and assembling a team of more than 10 skilled instructors. The center became known for its innovative teaching methods, engaging classroom activities, and a personalized approach that helped learners build confidence in using English in real-life contexts.",
    },
    {
      status: 'Year 2018: Growth',
      icon: faBuilding,
      color: '#FF9800',
      description: "To meet the growing demand for quality English education, EVOLEC opened its second branch in a nearby district. This expansion allowed the center to serve a wider community, offer more class schedules, and introduce specialized programs such as IELTS preparation and business English. The move marked a turning point in EVOLEC’s journey toward becoming a leading language center.",
    },
    {
      status: 'Year 2022: Regconition',
      icon: faArrowUpRightDots,
      color: '#9C27B0',
      description: "Recognizing the importance of English in the professional world, EVOLEC began collaborating with local companies to deliver customized corporate training programs. These partnerships helped employees across various industries improve their communication skills, prepare for international certification exams, and engage more effectively in global business environments.",
    },
    {
      status: 'Year 2024: Go to Global',
      icon: faEarthAmericas,
      color: '#FF6666',
      description: "EVOLEC achieved a major milestone by launching its first international branch, bringing its proven educational model to students abroad. This global expansion not only broadened the center’s impact but also opened up opportunities for cross-cultural exchange, international teacher development, and collaborative research in language education.",
    },
    {
      status: 'Now',
      icon: faClock,
      color: '#607D8B',
      description: "Today, EVOLEC continues to grow and innovate. The center has been recognized by multinational corporations and educational institutions for its excellence in teaching, curriculum development, and learner support. EVOLEC has also earned awards in national and international competitions focused on education, technology integration, and social impact in language learning.",
    }
  ]


  const customizedMarker = (item) => {
    return (
      <span className="flex flex-wrap w-[3rem] h-[3rem] items-center text-center justify-around text-white z-1 shadow-1 marker" style={{ backgroundColor: item.color }}>
        <FontAwesomeIcon icon={item.icon} />
      </span>
    );
  };

  const customizedContent = (item) => {
    return (
      <Card title={item.status}>
        {item.image && <img src={item.image} alt={item.name} width={200} className="shadow-1" />}
        <p>{item.description}</p>
      </Card>
    );
  };

  return (
    <div className='container'>
      <div className='main-title my-10'>
        <div className='text-center mb-[75px]'>
          <span>After a decade of development, EVOLEC always try our best to bring you a perfect services</span> <br />
          <span>We really appriciate your support also your effort to get the goals</span> <br /> <br />
          <span className='last-row'>Now, let's introduce the lifespan of EVOLEC</span>
        </div>
      </div>
      <div className="card w-full">
        <Timeline value={events} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
      </div>
    </div>
  )
}

export default AboutUsPage;