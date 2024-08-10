import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [currentSection, setCurrentSection] = useState("basic");

  // State for dynamic fields
  const [educationFields, setEducationFields] = useState([{ college: "", year: "", specialization: "" }]);
  const [experienceFields, setExperienceFields] = useState([{ company: "", role: "", duration: "", description: "" }]);
  const [languageFields, setLanguageFields] = useState([{ language: "", proficiency: "" }]);
  const [skillFields, setSkillFields] = useState([{ skill: "", proficiency: "" }]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleAddMoreEducation = () => {
    setEducationFields([...educationFields, { college: "", year: "", specialization: "" }]);
  };

  const handleAddMoreExperience = () => {
    setExperienceFields([...experienceFields, { company: "", role: "", duration: "", description: "" }]);
  };

  const handleAddMoreLanguage = () => {
    setLanguageFields([...languageFields, { language: "", proficiency: "" }]);
  };

  const handleAddMoreSkill = () => {
    setSkillFields([...skillFields, { skill: "", proficiency: "" }]);
  };

  const handleInputChange = (e, index, section) => {
    const { name, value } = e.target;

    switch (section) {
      case "education":
        const updatedEducationFields = [...educationFields];
        updatedEducationFields[index][name] = value;
        setEducationFields(updatedEducationFields);
        break;
      case "experience":
        const updatedExperienceFields = [...experienceFields];
        updatedExperienceFields[index][name] = value;
        setExperienceFields(updatedExperienceFields);
        break;
      case "languages":
        const updatedLanguageFields = [...languageFields];
        updatedLanguageFields[index][name] = value;
        setLanguageFields(updatedLanguageFields);
        break;
      case "skills":
        const updatedSkillFields = [...skillFields];
        updatedSkillFields[index][name] = value;
        setSkillFields(updatedSkillFields);
        break;
      default:
        break;
    }
  };

  const sections = ["basic", "education", "experience", "languages", "skills"];

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-5 text-center p-0 mt-3 mb-2">
          <div className="card1 px-0 pt-4 pb-0 mt-3 mb-3">
            <form id="profile-form">
              <ul id="section-tabs">
                {sections.map((section) => (
                  <li
                    key={section}
                    className={currentSection === section ? "active" : ""}
                    onClick={() => handleSectionChange(section)}
                  >
                    <strong>{section.charAt(0).toUpperCase() + section.slice(1)}</strong>
                  </li>
                ))}
              </ul>
              <div className="section-content">
                {currentSection === "basic" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Basic Information:</h2>

                      {/* <!-- First Row --> */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="fieldlabels">First Name: *</label>
                          <input type="text" name="fname" placeholder="First Name" />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Middle Name:</label>
                          <input type="text" name="mname" placeholder="Middle Name" />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Last Name: *</label>
                          <input type="text" name="lname" placeholder="Last Name" />
                        </div>
                      </div>

                      {/* <!-- Second Row --> */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="fieldlabels">Gender: *</label>
                          <input type="text" name="gender" placeholder="Gender" />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Date of Birth: *</label>
                          <input type="date" name="dob" placeholder="Date of Birth" />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Country: *</label>
                          <input type="text" name="country" placeholder="Country" />
                        </div>
                      </div>

                      {/* <!-- Third Row --> */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="fieldlabels">State/Province: *</label>
                          <input type="text" name="state" placeholder="State/Province" />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">City: *</label>
                          <input type="text" name="city" placeholder="City" />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Contact Number: *</label>
                          <input type="text" name="contact" placeholder="Contact Number" />
                        </div>
                      </div>

                      {/* <!-- Fourth Row --> */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="fieldlabels">Email ID: *</label>
                          <input type="email" name="email" placeholder="Email ID" />
                        </div>
                      </div>

                      <input type="button" name="save" className="action-button" value="Save" />
                    </div>
                  </fieldset>
                )}
                {currentSection === "education" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Education:</h2>
                      {educationFields.map((field, index) => (
                        <div key={index} className="form-row">
                          <div className="form-group">
                            <label className="fieldlabels">College/University: *</label>
                            <input
                              type="text"
                              name="college"
                              value={field.college}
                              placeholder="College/University"
                              onChange={(e) => handleInputChange(e, index, "education")}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Year of Passing: *</label>
                            <input
                              type="text"
                              name="year"
                              value={field.year}
                              placeholder="Year of Passing"
                              onChange={(e) => handleInputChange(e, index, "education")}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Specialization: *</label>
                            <input
                              type="text"
                              name="specialization"
                              value={field.specialization}
                              placeholder="Specialization"
                              onChange={(e) => handleInputChange(e, index, "education")}
                            />
                          </div>
                        </div>
                      ))}
                      <input
                        type="button"
                        name="addMore"
                        className="action-button"
                        value="Add More"
                        onClick={handleAddMoreEducation}
                      />
                      <input type="button" name="save" className="action-button" value="Save" />
                    </div>
                  </fieldset>
                )}
                {currentSection === "experience" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Experience:</h2>
                      {experienceFields.map((field, index) => (
                        <div key={index}>
                          <label className="fieldlabels">Company: *</label>
                          <input
                            type="text"
                            name="company"
                            value={field.company}
                            placeholder="Company"
                            onChange={(e) => handleInputChange(e, index, "experience")}
                          />
                          <label className="fieldlabels">Role: *</label>
                          <input
                            type="text"
                            name="role"
                            value={field.role}
                            placeholder="Role"
                            onChange={(e) => handleInputChange(e, index, "experience")}
                          />
                          <label className="fieldlabels">Duration: *</label>
                          <input
                            type="text"
                            name="duration"
                            value={field.duration}
                            placeholder="Duration"
                            onChange={(e) => handleInputChange(e, index, "experience")}
                          />
                          <label className="fieldlabels">Description:</label>
                          <textarea
                            name="description"
                            value={field.description}
                            placeholder="Description"
                            onChange={(e) => handleInputChange(e, index, "experience")}
                          ></textarea>
                        </div>
                      ))}
                      <input
                        type="button"
                        name="addMore"
                        className="action-button"
                        value="Add More"
                        onClick={handleAddMoreExperience}
                      />
                    </div>
                    <input type="button" name="save" className="action-button" value="Save" />
                  </fieldset>
                )}
                {currentSection === "languages" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Languages:</h2>
                      {languageFields.map((field, index) => (
                        <div key={index}>
                          <label className="fieldlabels">Language: *</label>
                          <input
                            type="text"
                            name="language"
                            value={field.language}
                            placeholder="Language"
                            onChange={(e) => handleInputChange(e, index, "languages")}
                          />
                          <label className="fieldlabels">Proficiency: *</label>
                          <input
                            type="text"
                            name="proficiency"
                            value={field.proficiency}
                            placeholder="Proficiency"
                            onChange={(e) => handleInputChange(e, index, "languages")}
                          />
                        </div>
                      ))}
                      <input
                        type="button"
                        name="addMore"
                        className="action-button"
                        value="Add More"
                        onClick={handleAddMoreLanguage}
                      />
                    </div>
                    <input type="button" name="save" className="action-button" value="Save" />
                  </fieldset>
                )}
                {currentSection === "skills" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Skills:</h2>
                      {skillFields.map((field, index) => (
                        <div key={index}>
                          <label className="fieldlabels">Skill: *</label>
                          <input
                            type="text"
                            name="skill"
                            value={field.skill}
                            placeholder="Skill"
                            onChange={(e) => handleInputChange(e, index, "skills")}
                          />
                          <label className="fieldlabels">Proficiency: *</label>
                          <input
                            type="text"
                            name="skillProficiency"
                            value={field.proficiency}
                            placeholder="Proficiency"
                            onChange={(e) => handleInputChange(e, index, "skills")}
                          />
                        </div>
                      ))}
                      <input
                        type="button"
                        name="addMore"
                        className="action-button"
                        value="Add More"
                        onClick={handleAddMoreSkill}
                      />
                    </div>
                    <input type="button" name="save" className="action-button" value="Save" />
                  </fieldset>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
