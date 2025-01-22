import { Helmet } from "react-helmet-async";
import AllTutor from "./AllTutor";
import Banner from "./Banner";
import StudySession from "./StudySession";


const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Study Hive || Home</title>
            </Helmet>
            <Banner/>
            <StudySession/>
            <AllTutor/>
        </div>
    );
};

export default Home;