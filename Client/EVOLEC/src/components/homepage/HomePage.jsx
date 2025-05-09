import { Divider, Group, Title } from "@mantine/core";
import TeacherImg1 from "../../assets/homepage/Teacher1.jpg";
import './HomePage.css';
import HomePageIntroBox from "./HomePageIntroBox";
import HomePageFeatureBox from "./HomePageFeatureBox";
import HomePageStatusBox from "./HomePageStatusBox";
const HomePage = () => {
  return (
    <div className="container w-full ">
      <HomePageIntroBox />
      <Divider size="md" className="line-divider" />
      <HomePageFeatureBox />
      <Divider size="md" className="line-divider" />
      <HomePageStatusBox />
      <Divider size="md" className="line-divider" />
      
    </div >
  )
}

export default HomePage;