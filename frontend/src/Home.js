import React from "react";
import "./Home.css"; // Ensure you import the CSS

const Home = () => {
  const cardData = [
    {
      date: "2024-07-23",
      topic: "Project Management Update",
      description: "Learn about the latest updates in our project management tools and how they can streamline your workflow.",
    },
    {
      date: "2024-07-22",
      topic: "New AI Features",
      description: "Discover the new AI-driven features that enhance your project tracking and efficiency.",
    },
    {
      date: "2024-07-21",
      topic: "Client Success Stories",
      description: "Read about our recent success stories and how we helped clients achieve their goals.",
    },
    {
      date: "2024-07-20",
      topic: "Upcoming Webinars",
      description: "Join our upcoming webinars to stay updated on the latest industry trends and best practices.",
    },
    {
      date: "2024-07-19",
      topic: "Team Expansion",
      description: "Meet the new members of our team and learn about their expertise and how they will contribute to our growth.",
    },
  ];

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Home Page</p>
      <div className="cards-container">
        {cardData.map((card, index) => (
          <div key={index} className="card">
            <div className="date">{card.date}</div>
            <h2>{card.topic}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
