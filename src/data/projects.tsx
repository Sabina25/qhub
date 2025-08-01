
  const projects = [
    {
      id: "1",
      title: "EuroVoices",
      description: "Amplifying young European voices in policy-making through digital platforms and civic engagement initiatives.",
      image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      funding: "Erasmus+ Programme",
      duration: "2023-2025",
      participants: "15 countries"
    },
  ];
  
export const addProject = (newProj) => {
  projects.unshift(newProj); 
};

  export default projects;