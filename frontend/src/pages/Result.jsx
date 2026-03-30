import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
const Result = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get(`/attempt/${id}/result`).then((res) => {
      setData(res.data);
    });
  }, [id]);
  if (!data) return <h3>Loading...</h3>;

  return (
    <div>
      <Navbar />
      <h2>Score: {data.score}</h2>
      {data.detail.map((item, index) => (
        <div key={index}>
          <p>{item.question}</p>
          <p>Correct:{item.correct}</p>
          <p>Your Answer:{item.selected}</p>
        </div>
      ))}
    </div>
  );
};

export default Result;
