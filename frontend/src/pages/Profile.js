import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [currentSection, setCurrentSection] = useState('basic');

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const sections = [
    'basic', 'education', 'experience', 'languages', 'skills', 'payment'
  ];

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-5 text-center p-0 mt-3 mb-2">
          <div className="card1 px-0 pt-4 pb-0 mt-3 mb-3">
            <p>Fill out or update your profile details</p>
            <form id="profile-form">
              <ul id="section-tabs">
                {sections.map(section => (
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
                {currentSection === 'basic' && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Basic Information:</h2>
                      <label className="fieldlabels">First Name: *</label>
                      <input type="text" name="fname" placeholder="First Name" />
                      <label className="fieldlabels">Middle Name:</label>
                      <input type="text" name="mname" placeholder="Middle Name" />
                      <label className="fieldlabels">Last Name: *</label>
                      <input type="text" name="lname" placeholder="Last Name" />
                      <label className="fieldlabels">Gender: *</label>
                      <input type="text" name="gender" placeholder="Gender" />
                      <label className="fieldlabels">Date of Birth: *</label>
                      <input type="date" name="dob" placeholder="Date of Birth" />
                      <label className="fieldlabels">Country: *</label>
                      <input type="text" name="country" placeholder="Country" />
                      <label className="fieldlabels">State/Province: *</label>
                      <input type="text" name="state" placeholder="State/Province" />
                      <label className="fieldlabels">City: *</label>
                      <input type="text" name="city" placeholder="City" />
                      <label className="fieldlabels">Contact Number: *</label>
                      <input type="text" name="contact" placeholder="Contact Number" />
                      <label className="fieldlabels">Email ID: *</label>
                      <input type="email" name="email" placeholder="Email ID" />
                    </div>
                    <input type="button" name="save" className="action-button" value="Save" />
                  </fieldset>
                )}
                {currentSection === 'education' && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Education:</h2>
                      <label className="fieldlabels">College/University: *</label>
                      <input type="text" name="college" placeholder="College/University" />
                      <label className="fieldlabels">Year of Passing: *</label>
                      <input type="text" name="year" placeholder="Year of Passing" />
                      <label className="fieldlabels">Specialization: *</label>
                      <input type="text" name="specialization" placeholder="Specialization" />
                      <input type="button" name="addMore" className="action-button" value="Add More" />
                    </div>
                    <input type="button" name="save" className="action-button" value="Save" />
                  </fieldset>
                )}
                {currentSection === 'experience' && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Experience:</h2>
                      <label className="fieldlabels">Company: *</label>
                      <input type="text" name="company" placeholder="Company" />
                      <label className="fieldlabels">Role: *</label>
                      <input type="text" name="role" placeholder="Role" />
                      <label className="fieldlabels">Duration: *</label>
                      <input type="text" name="duration" placeholder="Duration" />
                      <label className="fieldlabels">Description:</label>
                      <textarea name="description" placeholder="Description"></textarea>
                      <input type="button" name="addMore" className="action-button" value="Add More" />
                    </div>
                    <input type="button" name="save" className="action-button" value="Save" />
                  </fieldset>
                )}
                {currentSection === 'languages' && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Languages:</h2>
                      <label className="fieldlabels">Language: *</label>
                      <input type="text" name="language" placeholder="Language" />
                      <label className="fieldlabels">Proficiency: *</label>
                      <input type="text" name="proficiency" placeholder="Proficiency" />
                      <input type="button" name="addMore" className="action-button" value="Add More" />
                    </div>
                    <input type="button" name="save" className="action-button" value="Save" />
                  </fieldset>
                )}
                {currentSection === 'skills' && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Skills:</h2>
                      <label className="fieldlabels">Skill: *</label>
                      <input type="text" name="skill" placeholder="Skill" />
                      <label className="fieldlabels">Proficiency: *</label>
                      <input type="text" name="skillProficiency" placeholder="Proficiency" />
                      <input type="button" name="addMore" className="action-button" value="Add More" />
                    </div>
                    <input type="button" name="save" className="action-button" value="Save" />
                  </fieldset>
                )}
                {currentSection === 'payment' && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Payment Information:</h2>
                      <label className="fieldlabels">Credit Card Number: *</label>
                      <input type="text" name="cardNumber" placeholder="Credit Card Number" />
                      <label className="fieldlabels">Expiry Date: *</label>
                      <input type="text" name="expiryDate" placeholder="Expiry Date" />
                      <label className="fieldlabels">CVV: *</label>
                      <input type="text" name="cvv" placeholder="CVV" />
                      <label className="fieldlabels">Name on Card: *</label>
                      <input type="text" name="cardName" placeholder="Name on Card" />
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
