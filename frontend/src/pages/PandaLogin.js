import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, register } from "../Services/Actions/userAction.js";
import "./PandaLogin.css";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const PandaLogin = () => {
  const navigate = useNavigate();

  // const [signUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [rePassword, setRePassword] = useState(/"");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // To track if OTP is sent
  const [emailVerified, setEmailVerified] = useState(false); // To track if email is verified
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState({ name: "", iso: "" });
  const [currency, setCurrency] = useState({ name: "", iso: "" });
  const [languages, setLanguages] = useState([{ name: "", proficiency: "" }]);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const sendOtpToEmail = () => {
    fetch("/aak/l1/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOtpSent(true);
          setPopupMessage("OTP has been sent to your email.");
        } else {
          setPopupMessage(data.message || "Failed to send OTP.");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const verifyOtp = () => {
    fetch("/aak/l1/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEmailVerified(true);
          setPopupMessage("Email verified successfully.");
        } else {
          setPopupMessage(data.message || "Invalid OTP.");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const dispatch = useDispatch();

  const handleToggle = () => {
    setSignUp(!signUp);
    animateFields(signUp ? "login" : "signup");
  };

  const animateFields = (form) => {
    // Animation logic here
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signUp) {
      if (password !== rePassword) {
        alert("Passwords do not match");
        return;
      }

      const referringUserId = localStorage.getItem("referringUserId");
      const referredStudyId = localStorage.getItem("referredStudyId");

      const userData = {
        firstName,
        lastName,
        email,
        password,
        gender,
        languages,
        dateOfBirth,
        country: country.name,
        countryIso: country.iso,
        currency: currency.name,
        currencyIso: currency.iso,
        referralId: referringUserId || null,
        studyId: referredStudyId || null,
      };
      console.log(userData);

      dispatch(register(userData)).then(() => {
        setPopupMessage("Registration successful!");

        // Clear local storage items
        localStorage.removeItem("referringUserId");
        localStorage.removeItem("referredStudyId");

        // Redirect to /invited-study if referredStudyId exists
        if (referredStudyId) {
          navigate("/invited-study");

          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
    } else {
      const referralId = localStorage.getItem("referringUserId");
      const studyId = localStorage.getItem("referredStudyId");

      dispatch(login(loginName, loginPassword, referralId || null, studyId || null)).then(() => {
        setPopupMessage("Login successful!");

        localStorage.removeItem("referringUserId");
        localStorage.removeItem("referredStudyId");

        if (referralId) {
          navigate("/invited-study");

          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
    }
  };

  // Inside PandaLogin component render
  return (
    <div className="loginpage">
      {!signUp ? (
        <Login
          loginName={loginName}
          loginPassword={loginPassword}
          setLoginName={setLoginName}
          setLoginPassword={setLoginPassword}
          handleToggle={handleToggle}
          handleSubmit={handleSubmit}
        />
      ) : (
        <SignUp
          email={email}
          otp={otp}
          otpSent={otpSent}
          emailVerified={emailVerified}
          setEmail={setEmail}
          setOtp={setOtp}
          sendOtpToEmail={sendOtpToEmail}
          verifyOtp={verifyOtp}
          firstName={firstName}
          lastName={lastName}
          languages={languages}
          setLanguages={setLanguages}
          password={password}
          rePassword={rePassword}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPassword={setPassword}
          setRePassword={setRePassword}
          gender={gender} // Add gender prop
          setGender={setGender} // Add setGender prop
          country={country} // Add country prop
          currency={currency} // Add country prop
          setCountry={setCountry} // Add setCountry prop
          setCurrency={setCurrency} // Add setCountry prop
          dateOfBirth={dateOfBirth} // Add dateOfBirth prop
          setDateOfBirth={setDateOfBirth} // Add setDateOfBirth prop
          handleToggle={handleToggle}
          handleSubmit={handleSubmit}
          popupMessage={popupMessage}
          setPopupMessage={setPopupMessage}
        />
      )}

      <Modal
        isOpen={!!popupMessage}
        onRequestClose={() => setPopupMessage("")}
        className="unique-popup-modal"
        overlayClassName="unique-popup-overlay"
      >
        <div className="unique-popup-content">
          <h2 className="unique-popup-title">Notification</h2>
          <p className="unique-popup-message">{popupMessage}</p>
          <button className="unique-popup-close-btn" onClick={() => setPopupMessage("")}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

const Login = ({ loginName, loginPassword, setLoginName, setLoginPassword, handleToggle, handleSubmit }) => (
  <div className="login">
    <h1>Log In</h1>
    <hr />
    <form onSubmit={handleSubmit}>
      <Input label="User Name (email)" type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
      <Input
        label="Password"
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <Submit />
    </form>
    <SignupLink handleToggle={handleToggle} />
  </div>
);

const SignUp = ({
  email,
  otp,
  otpSent,
  emailVerified,
  setEmail,
  setOtp,
  sendOtpToEmail,
  verifyOtp,
  firstName,
  lastName,
  password,
  rePassword,
  setFirstName,
  setLastName,
  setPassword,
  setRePassword,
  gender,
  setGender,
  country,
  currency,
  setCurrency,
  setCountry,
  languages,
  setLanguages,
  handleToggle,
  handleSubmit,
  dateOfBirth,
  setDateOfBirth, // Added setter for dateOfBirth
  setPopupMessage,
  popupMessage,
}) => {
  // Handler to add a new language
  const addLanguage = () => setLanguages([...languages, { name: "", proficiency: "" }]);

  // Handler to remove a language entry
  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  // Handler to update language entry
  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = languages.map((language, i) => (i === index ? { ...language, [field]: value } : language));
    setLanguages(updatedLanguages);
  };

  // UseEffect to log languages when it changes
  useEffect(() => {
    console.log("Languages state updated:", languages);
  }, [languages]);
  const countries = [
    { country: "Afghanistan", iso: "AF" },
    { country: "Albania", iso: "AL" },
    { country: "Algeria", iso: "DZ" },
    { country: "American Samoa", iso: "AS" },
    { country: "Andorra", iso: "AD" },
    { country: "Angola", iso: "AO" },
    { country: "Argentina", iso: "AR" },
    { country: "Armenia", iso: "AM" },
    { country: "Australia", iso: "AU" },
    { country: "Austria", iso: "AT" },
    { country: "Azerbaijan", iso: "AZ" },
    { country: "Bahamas", iso: "BS" },
    { country: "Bahrain", iso: "BH" },
    { country: "Bangladesh", iso: "BD" },
    { country: "Barbados", iso: "BB" },
    { country: "Belarus", iso: "BY" },
    { country: "Belgium", iso: "BE" },
    { country: "Belize", iso: "BZ" },
    { country: "Benin", iso: "BJ" },
    { country: "Bhutan", iso: "BT" },
    { country: "Bolivia", iso: "BO" },
    { country: "Bosnia and Herzegovina", iso: "BA" },
    { country: "Botswana", iso: "BW" },
    { country: "Brazil", iso: "BR" },
    { country: "Brunei Darussalam", iso: "BN" },
    { country: "Bulgaria", iso: "BG" },
    { country: "Burkina Faso", iso: "BF" },
    { country: "Burundi", iso: "BI" },
    { country: "Cambodia", iso: "KH" },
    { country: "Cameroon", iso: "CM" },
    { country: "Canada", iso: "CA" },
    { country: "Cape Verde", iso: "CV" },
    { country: "Cayman Islands", iso: "KY" },
    { country: "Central African Republic", iso: "CF" },
    { country: "Chad", iso: "TD" },
    { country: "Chile", iso: "CL" },
    { country: "China", iso: "CN" },
    { country: "Colombia", iso: "CO" },
    { country: "Comoros", iso: "KM" },
    { country: "Congo", iso: "CG" },
    { country: "Democratic Republic of the Congo", iso: "CD" },
    { country: "Costa Rica", iso: "CR" },
    { country: "Côte d'Ivoire", iso: "CI" },
    { country: "Croatia", iso: "HR" },
    { country: "Cuba", iso: "CU" },
    { country: "Cyprus", iso: "CY" },
    { country: "Czech Republic", iso: "CZ" },
    { country: "Denmark", iso: "DK" },
    { country: "Djibouti", iso: "DJ" },
    { country: "Dominica", iso: "DM" },
    { country: "Dominican Republic", iso: "DO" },
    { country: "Ecuador", iso: "EC" },
    { country: "Egypt", iso: "EG" },
    { country: "El Salvador", iso: "SV" },
    { country: "Equatorial Guinea", iso: "GQ" },
    { country: "Eritrea", iso: "ER" },
    { country: "Estonia", iso: "EE" },
    { country: "Ethiopia", iso: "ET" },
    { country: "Falkland Islands", iso: "FK" },
    { country: "Faroe Islands", iso: "FO" },
    { country: "Fiji", iso: "FJ" },
    { country: "Finland", iso: "FI" },
    { country: "France", iso: "FR" },
    { country: "Gabon", iso: "GA" },
    { country: "Gambia", iso: "GM" },
    { country: "Georgia", iso: "GE" },
    { country: "Germany", iso: "DE" },
    { country: "Ghana", iso: "GH" },
    { country: "Gibraltar", iso: "GI" },
    { country: "Greece", iso: "GR" },
    { country: "Greenland", iso: "GL" },
    { country: "Grenada", iso: "GD" },
    { country: "Guadeloupe", iso: "GP" },
    { country: "Guam", iso: "GU" },
    { country: "Guatemala", iso: "GT" },
    { country: "Guinea", iso: "GN" },
    { country: "Guinea-Bissau", iso: "GW" },
    { country: "Guyana", iso: "GY" },
    { country: "Haiti", iso: "HT" },
    { country: "Honduras", iso: "HN" },
    { country: "Hong Kong", iso: "HK" },
    { country: "Hungary", iso: "HU" },
    { country: "Iceland", iso: "IS" },
    { country: "India", iso: "IN" },
    { country: "Indonesia", iso: "ID" },
    { country: "Iran", iso: "IR" },
    { country: "Iraq", iso: "IQ" },
    { country: "Ireland", iso: "IE" },
    { country: "Israel", iso: "IL" },
    { country: "Italy", iso: "IT" },
    { country: "Jamaica", iso: "JM" },
    { country: "Japan", iso: "JP" },
    { country: "Jordan", iso: "JO" },
    { country: "Kazakhstan", iso: "KZ" },
    { country: "Kenya", iso: "KE" },
    { country: "Kiribati", iso: "KI" },
    { country: "North Korea", iso: "KP" },
    { country: "South Korea", iso: "KR" },
    { country: "Kuwait", iso: "KW" },
    { country: "Kyrgyzstan", iso: "KG" },
    { country: "Laos", iso: "LA" },
    { country: "Latvia", iso: "LV" },
    { country: "Lebanon", iso: "LB" },
    { country: "Lesotho", iso: "LS" },
    { country: "Liberia", iso: "LR" },
    { country: "Libya", iso: "LY" },
    { country: "Liechtenstein", iso: "LI" },
    { country: "Lithuania", iso: "LT" },
    { country: "Luxembourg", iso: "LU" },
    { country: "Macau", iso: "MO" },
    { country: "North Macedonia", iso: "MK" },
    { country: "Madagascar", iso: "MG" },
    { country: "Malawi", iso: "MW" },
    { country: "Malaysia", iso: "MY" },
    { country: "Maldives", iso: "MV" },
    { country: "Mali", iso: "ML" },
    { country: "Malta", iso: "MT" },
    { country: "Marshall Islands", iso: "MH" },
    { country: "Martinique", iso: "MQ" },
    { country: "Mauritania", iso: "MR" },
    { country: "Mauritius", iso: "MU" },
    { country: "Mexico", iso: "MX" },
    { country: "Micronesia", iso: "FM" },
    { country: "Moldova", iso: "MD" },
    { country: "Monaco", iso: "MC" },
    { country: "Mongolia", iso: "MN" },
    { country: "Montenegro", iso: "ME" },
    { country: "Montserrat", iso: "MS" },
    { country: "Morocco", iso: "MA" },
    { country: "Mozambique", iso: "MZ" },
    { country: "Myanmar", iso: "MM" },
    { country: "Namibia", iso: "NA" },
    { country: "Nauru", iso: "NR" },
    { country: "Nepal", iso: "NP" },
    { country: "Netherlands", iso: "NL" },
    { country: "New Caledonia", iso: "NC" },
    { country: "New Zealand", iso: "NZ" },
    { country: "Nicaragua", iso: "NI" },
    { country: "Niger", iso: "NE" },
    { country: "Nigeria", iso: "NG" },
    { country: "Niue", iso: "NU" },
    { country: "Norfolk Island", iso: "NF" },
    { country: "Northern Mariana Islands", iso: "MP" },
    { country: "Norway", iso: "NO" },
    { country: "Oman", iso: "OM" },
    { country: "Pakistan", iso: "PK" },
    { country: "Palau", iso: "PW" },
    { country: "Panama", iso: "PA" },
    { country: "Papua New Guinea", iso: "PG" },
    { country: "Paraguay", iso: "PY" },
    { country: "Peru", iso: "PE" },
    { country: "Philippines", iso: "PH" },
    { country: "Pitcairn Islands", iso: "PN" },
    { country: "Poland", iso: "PL" },
    { country: "Portugal", iso: "PT" },
    { country: "Puerto Rico", iso: "PR" },
    { country: "Qatar", iso: "QA" },
    { country: "Romania", iso: "RO" },
    { country: "Russia", iso: "RU" },
    { country: "Rwanda", iso: "RW" },
    { country: "Réunion", iso: "RE" },
    { country: "Saint Barthélemy", iso: "BL" },
    { country: "Saint Helena", iso: "SH" },
    { country: "Saint Kitts and Nevis", iso: "KN" },
    { country: "Saint Lucia", iso: "LC" },
    { country: "Saint Martin", iso: "MF" },
    { country: "Saint Pierre and Miquelon", iso: "PM" },
    { country: "Saint Vincent and the Grenadines", iso: "VC" },
    { country: "Samoa", iso: "WS" },
    { country: "San Marino", iso: "SM" },
    { country: "São Tomé and Príncipe", iso: "ST" },
    { country: "Saudi Arabia", iso: "SA" },
    { country: "Senegal", iso: "SN" },
    { country: "Serbia", iso: "RS" },
    { country: "Seychelles", iso: "SC" },
    { country: "Sierra Leone", iso: "SL" },
    { country: "Singapore", iso: "SG" },
    { country: "Sint Maarten", iso: "SX" },
    { country: "Slovakia", iso: "SK" },
    { country: "Slovenia", iso: "SI" },
    { country: "Solomon Islands", iso: "SB" },
    { country: "Somalia", iso: "SO" },
    { country: "South Africa", iso: "ZA" },
    { country: "South Georgia and the South Sandwich Islands", iso: "GS" },
    { country: "South Sudan", iso: "SS" },
    { country: "Spain", iso: "ES" },
    { country: "Sri Lanka", iso: "LK" },
    { country: "Sudan", iso: "SD" },
    { country: "Suriname", iso: "SR" },
    { country: "Svalbard and Jan Mayen", iso: "SJ" },
    { country: "Eswatini", iso: "SZ" },
    { country: "Sweden", iso: "SE" },
    { country: "Switzerland", iso: "CH" },
    { country: "Syria", iso: "SY" },
    { country: "Taiwan", iso: "TW" },
    { country: "Tajikistan", iso: "TJ" },
    { country: "Tanzania", iso: "TZ" },
    { country: "Thailand", iso: "TH" },
    { country: "Timor-Leste", iso: "TL" },
    { country: "Togo", iso: "TG" },
    { country: "Tonga", iso: "TO" },
    { country: "Trinidad and Tobago", iso: "TT" },
    { country: "Tunisia", iso: "TN" },
    { country: "Turkey", iso: "TR" },
    { country: "Turkmenistan", iso: "TM" },
    { country: "Tuvalu", iso: "TV" },
    { country: "Uganda", iso: "UG" },
    { country: "Ukraine", iso: "UA" },
    { country: "United Arab Emirates", iso: "AE" },
    { country: "United Kingdom", iso: "GB" },
    { country: "United States", iso: "US" },
    { country: "Uruguay", iso: "UY" },
    { country: "Uzbekistan", iso: "UZ" },
    { country: "Vanuatu", iso: "VU" },
    { country: "Vatican City", iso: "VA" },
    { country: "Venezuela", iso: "VE" },
    { country: "Vietnam", iso: "VN" },
    { country: "Yemen", iso: "YE" },
    { country: "Zambia", iso: "ZM" },
    { country: "Zimbabwe", iso: "ZW" },
  ];

  // Currency data with ISO codes
  const currencies = [
    { currency: "Afghani", iso: "AFN" },
    { currency: "Albanian lek", iso: "ALL" },
    { currency: "Algerian dinar", iso: "DZD" },
    { currency: "US dollar", iso: "USD" },
    { currency: "Euro", iso: "EUR" },
    { currency: "Kwanza", iso: "AOA" },
    { currency: "Argentine peso", iso: "ARS" },
    { currency: "Dram", iso: "AMD" },
    { currency: "Azerbaijani manat", iso: "AZN" },
    { currency: "Bahamian dollar", iso: "BSD" },
    { currency: "Bahraini dinar", iso: "BHD" },
    { currency: "Taka", iso: "BDT" },
    { currency: "Barbadian dollar", iso: "BBD" },
    { currency: "Belarusian ruble", iso: "BYN" },
    { currency: "Belize dollar", iso: "BZD" },
    { currency: "Ngultrum", iso: "BTN" },
    { currency: "Bolivian boliviano", iso: "BOB" },
    { currency: "Convertible mark", iso: "BAM" },
    { currency: "Pula", iso: "BWP" },
    { currency: "Brazilian real", iso: "BRL" },
    { currency: "Brunei dollar", iso: "BND" },
    { currency: "Lev", iso: "BGN" },
    { currency: "Burundian franc", iso: "BIF" },
    { currency: "Riel", iso: "KHR" },
    { currency: "Central African CFA franc", iso: "XAF" },
    { currency: "Canadian dollar", iso: "CAD" },
    { currency: "Cape Verdean escudo", iso: "CVE" },
    { currency: "Cayman Islands dollar", iso: "KYD" },
    { currency: "Congolese franc", iso: "CDF" },
    { currency: "Costa Rican colón", iso: "CRC" },
    { currency: "Chilean peso", iso: "CLP" },
    { currency: "Renminbi (Yuan)", iso: "CNY" },
    { currency: "Colombian peso", iso: "COP" },
    { currency: "Comorian franc", iso: "KMF" },
    { currency: "Cuban peso", iso: "CUP" },
    { currency: "Czech koruna", iso: "CZK" },
    { currency: "Djiboutian franc", iso: "DJF" },
    { currency: "Dominican peso", iso: "DOP" },
    { currency: "Egyptian pound", iso: "EGP" },
    { currency: "Eritrean nakfa", iso: "ERN" },
    { currency: "Ethiopian birr", iso: "ETB" },
    { currency: "Falkland Islands pound", iso: "FKP" },
    { currency: "Danish krone", iso: "DKK" },
    { currency: "Fijian dollar", iso: "FJD" },
    { currency: "Gambian dalasi", iso: "GMD" },
    { currency: "Georgian lari", iso: "GEL" },
    { currency: "Ghanaian cedi", iso: "GHS" },
    { currency: "Gibraltar pound", iso: "GIP" },
    { currency: "Guatemalan quetzal", iso: "GTQ" },
    { currency: "Guinean franc", iso: "GNF" },
    { currency: "Guyanaese dollar", iso: "GYD" },
    { currency: "Haitian gourde", iso: "HTG" },
    { currency: "Honduran lempira", iso: "HNL" },
    { currency: "Hong Kong dollar", iso: "HKD" },
    { currency: "Hungarian forint", iso: "HUF" },
    { currency: "Icelandic króna", iso: "ISK" },
    { currency: "Indian rupee", iso: "INR" },
    { currency: "Indonesian rupiah", iso: "IDR" },
    { currency: "Iranian rial", iso: "IRR" },
    { currency: "Iraqi dinar", iso: "IQD" },
    { currency: "Israeli new shekel", iso: "ILS" },
    { currency: "Jamaican dollar", iso: "JMD" },
    { currency: "Japanese yen", iso: "JPY" },
    { currency: "Jordanian dinar", iso: "JOD" },
    { currency: "Kazakhstani tenge", iso: "KZT" },
    { currency: "Kenyan shilling", iso: "KES" },
    { currency: "Australian dollar /Tuvaluan dollar", iso: "AUD" },
    { currency: "North Korean won", iso: "KPW" },
    { currency: "South Korean won", iso: "KRW" },
    { currency: "Kuwaiti dinar", iso: "KWD" },
    { currency: "Kyrgyzstani som", iso: "KGS" },
    { currency: "Laotian kip", iso: "LAK" },
    { currency: "Lebanese pound", iso: "LBP" },
    { currency: "Lesotho loti", iso: "LSL" },
    { currency: "Liberian dollar", iso: "LRD" },
    { currency: "Libyan dinar", iso: "LYD" },
    { currency: "Swiss franc", iso: "CHF" },
    { currency: "Macanese pataca", iso: "MOP" },
    { currency: "Macedonian denar", iso: "MKD" },
    { currency: "Malagasy ariary", iso: "MGA" },
    { currency: "Malawian kwacha", iso: "MWK" },
    { currency: "Malaysian ringgit", iso: "MYR" },
    { currency: "Maldivian rufiyaa", iso: "MVR" },
    { currency: "West African CFA franc", iso: "XOF" },
    { currency: "Mauritanian ouguiya", iso: "MRU" },
    { currency: "Mauritian rupee", iso: "MUR" },
    { currency: "Mexican peso", iso: "MXN" },
    { currency: "Moldovan leu", iso: "MDL" },
    { currency: "Mongolian tugrik", iso: "MNT" },
    { currency: "Moroccan dirham", iso: "MAD" },
    { currency: "Mozambican metical", iso: "MZN" },
    { currency: "Myanmar kyat", iso: "MMK" },
    { currency: "Namibian dollar", iso: "NAD" },
    { currency: "Nepalese rupee", iso: "NPR" },
    { currency: "CFP franc", iso: "XPF" },
    { currency: "Nicaraguan córdoba", iso: "NIO" },
    { currency: "Nigerian naira", iso: "NGN" },
    { currency: "Omani rial", iso: "OMR" },
    { currency: "Pakistani rupee", iso: "PKR" },
    { currency: "Panamanian balboa", iso: "PAB" },
    { currency: "Kina", iso: "PGK" },
    { currency: "Guarani", iso: "PYG" },
    { currency: "Nuevo sol", iso: "PEN" },
    { currency: "Philippine peso", iso: "PHP" },
    { currency: "New Zealand dollar", iso: "NZD" },
    { currency: "Polish złoty", iso: "PLN" },
    { currency: "Qatari rial", iso: "QAR" },
    { currency: "Romanian leu", iso: "RON" },
    { currency: "Russian ruble", iso: "RUB" },
    { currency: "Rwandan franc", iso: "RWF" },
    { currency: "Saint Helena pound", iso: "SHP" },
    { currency: "East Caribbean dollar", iso: "XCD" },
    { currency: "Samoan tala", iso: "WST" },
    { currency: "São Tomé and Príncipe dobra", iso: "STN" },
    { currency: "Saudi riyal", iso: "SAR" },
    { currency: "Serbian dinar", iso: "RSD" },
    { currency: "Seychellois rupee", iso: "SCR" },
    { currency: "Leone", iso: "SLL" },
    { currency: "Singapore dollar", iso: "SGD" },
    { currency: "Netherlands Antillean guilder", iso: "ANG" },
    { currency: "Solomon Islands dollar", iso: "SBD" },
    { currency: "Somali shilling", iso: "SOS" },
    { currency: "South African rand", iso: "ZAR" },
    { currency: "British pound / Pound sterling ", iso: "GBP" },
    { currency: "South Sudanese pound", iso: "SSP" },
    { currency: "Sri Lankan rupee", iso: "LKR" },
    { currency: "Sudanese pound", iso: "SDG" },
    { currency: "Surinamese dollar", iso: "SRD" },
    { currency: "Norwegian krone", iso: "NOK" },
    { currency: "Swazi lilangeni", iso: "SZL" },
    { currency: "Swedish krona", iso: "SEK" },
    { currency: "Syrian pound", iso: "SYP" },
    { currency: "Taiwan dollar", iso: "TWD" },
    { currency: "Tajikistani somoni", iso: "TJS" },
    { currency: "Tanzanian shilling", iso: "TZS" },
    { currency: "Thai baht", iso: "THB" },
    { currency: "Timorese centavo", iso: "XTM" },
    { currency: "Tongan paʻanga", iso: "TOP" },
    { currency: "Trinidad and Tobago dollar", iso: "TTD" },
    { currency: "Tunisian dinar", iso: "TND" },
    { currency: "Turkish lira", iso: "TRY" },
    { currency: "Turkmenistan manat", iso: "TMT" },
    { currency: "Ugandan shilling", iso: "UGX" },
    { currency: "Ukrainian hryvnia", iso: "UAH" },
    { currency: "United Arab Emirates dirham", iso: "AED" },
    { currency: "Uruguayan peso", iso: "UYU" },
    { currency: "Uzbekistani soʻm", iso: "UZS" },
    { currency: "Vanuatu vatu", iso: "VUV" },
    { currency: "Vatican lira", iso: "VAL" }, // Used before switching to Euro
    { currency: "Venezuelan bolívar", iso: "VES" },
    { currency: "Vietnamese đồng", iso: "VND" },
    { currency: "Yemeni rial", iso: "YER" },
    { currency: "Zambian kwacha", iso: "ZMK" }, // Old currency, replaced by ZMW
    { currency: "Zambian kwacha", iso: "ZMW" }, // New currency
    { currency: "Zimbabwean dollar", iso: "ZWL" },
  ];

  return (
    <div className="sign-up-container">
      <h1>Sign Up</h1>
      <hr />
      {!emailVerified ? (
        <>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {otpSent ? (
            <>
              <Input label="Enter OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button className="submit-button" type="button" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          ) : (
            <button className="submit-button" type="button" onClick={sendOtpToEmail}>
              Send OTP
            </button>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="sign-up-form">
          {/* First Name and Last Name in one row */}
          <div className="sign-up-row">
            <div className="sign-up-field-firstname">
              <label className="sign-up-label">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="sign-up-input-firstname"
              />
            </div>
            <div className="sign-up-field-lastname">
              <label className="sign-up-label">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="sign-up-input-lastname"
              />
            </div>
          </div>

          {/* Gender, Country, and Date of Birth in one row */}
          <div className="sign-up-row">
            <div className="sign-up-field-gender">
              <label className="sign-up-label">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="sign-up-select-gender">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="sign-up-field-country">
              <label className="sign-up-label">Country</label>
              <select
                value={country.name}
                onChange={(e) => {
                  const selectedCountry = countries.find((item) => item.country === e.target.value);
                  setCountry({
                    name: selectedCountry?.country || "",
                    iso: selectedCountry?.iso || "",
                  });
                }}
                className="sign-up-select-country"
              >
                <option value="">Select Country</option>
                {countries.map((item) => (
                  <option key={item.iso} value={item.country}>
                    {item.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="sign-up-field-country">
              <label className="sign-up-label">Currency</label>
              <select
                value={currency?.name || ""} // Safely access `currency.name`
                onChange={(e) => {
                  const selectedCurrency = currencies.find((item) => item.currency === e.target.value);
                  console.log(selectedCurrency);
                  setCurrency({
                    name: selectedCurrency?.currency || "",
                    iso: selectedCurrency?.iso || "",
                  });
                  setPopupMessage(
                    <>
                      For GiftCard Payment, <strong>{selectedCurrency?.currency}</strong> will be used.
                    </>
                  );
                }}
                className="sign-up-select-country"
              >
                <option value="">Select Currency</option>
                {currencies.map((item) => (
                  <option key={item.iso} value={item.currency}>
                    {item.currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="sign-up-field-dob">
              <label className="sign-up-label">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="sign-up-input-dob"
              />
            </div>
          </div>

          {/* Languages Section */}
          <div className="sign-up-field-languages">
            <label className="sign-up-label">Languages</label>
            {languages.map((language, index) => (
              <div key={index} className="sign-up-language-container">
                <input
                  type="text"
                  placeholder="Language, e.g., English"
                  className="sign-up-input-language-name"
                  value={language.name}
                  onChange={(e) => handleLanguageChange(index, "name", e.target.value)}
                />
                <select
                  className="sign-up-select-proficiency"
                  value={language.proficiency}
                  onChange={(e) => handleLanguageChange(index, "proficiency", e.target.value)}
                >
                  <option value="">Proficiency</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="fluent">Fluent</option>
                </select>
                {languages.length > 1 && (
                  <span className="sign-up-remove-language-btn" onClick={() => removeLanguage(index)}>
                    ×
                  </span>
                )}
              </div>
            ))}
            <button type="button" className="sign-up-btn-add-language" onClick={addLanguage}>
              + Add Language
            </button>
          </div>

          {/* Password and Re-enter Password in one row */}
          <div className="sign-up-row">
            <div className="sign-up-field-password">
              <label className="sign-up-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sign-up-input-password"
              />
            </div>
            <div className="sign-up-field-repassword">
              <label className="sign-up-label">Re-Enter Password</label>
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="sign-up-input-repassword"
              />
            </div>
          </div>

          <button type="submit" className="sign-up-btn-submit">
            Sign Up
          </button>
        </form>
      )}
      <button type="button" className="sign-up-link-toggle" onClick={handleToggle}>
        Already have an account? Login
      </button>
    </div>
  );
};

const Input = ({ label, type, value, onChange }) => (
  <div className="field">
    <label className="label">{label}</label>
    <br />
    <input className="input" type={type} value={value} onChange={onChange} />
  </div>
);

const Submit = () => (
  <div>
    <hr />
    <button className="submit-button" type="submit">
      Submit
    </button>
  </div>
);

const SignupLink = ({ handleToggle }) => (
  <div className="signup-link">
    <p className="in-out">
      Don't have an account?{" "}
      <a href="#" onClick={handleToggle}>
        Sign Up Here
      </a>
    </p>
  </div>
);

const LoginLink = ({ handleToggle }) => (
  <div className="signup-link">
    <p className="in-out">
      Already have an account?{" "}
      <a href="#" onClick={handleToggle}>
        Log In Here
      </a>
    </p>
  </div>
);

export default PandaLogin;
