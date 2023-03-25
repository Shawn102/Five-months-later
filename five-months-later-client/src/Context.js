import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const myContext = createContext();

export const MyAppProvider = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [backEndData, setBackEndData] = useState();
  const [runDelete, setRunDelete] = useState(0);
  const [NewStoryRun, setNewStoryRun] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState([]);
  const [runToken, setRunToken] = useState([]);
  const [inputsOnChange, setInputOnChange] = useState({
    title: "",
    date: "",
    message: "",
  });
  const [formMessages, setFormMessages] = useState("");
  const [id, setId] = useState();
  const [isEditModeClicked, setIsModeClicked] = useState(false);
  const [editId, setEditId] = useState();
  const [runAfterEdit, setRunAfterEdit] = useState(false);
  const [axiosMessage, setAxiosMessage] = useState();
  // this for edit inputs
  const [inputChange, setInputs] = useState({
    title: "",
    date: "",
    message: "",
  });

  // getting token from localStorage and setting it to state
  const localStorageToken = localStorage.getItem("FiveMonthToken") || [];
  useEffect(() => {
    setToken(localStorageToken);
  }, [runToken]);
  // end of token setup

  const OnChangeHandle = (e) => {
    const { name, value } = e.target;
    setInputOnChange({
      ...inputsOnChange,
      [name]: value,
    });
  };
  const OnSubmitHandle = (event, navigate) => {
    event.preventDefault();
    const { title, date, message } = inputsOnChange;
    if (title === "" || date === "" || message === "") {
      setFormMessages("Can't submit the form please fill all the inputs!");
    } else {
      axios
        .post("http://localhost:5000/add", inputsOnChange, {
          headers: { Authorization: token },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          if (res.data) {
            setAxiosMessage(res.data.message);
            // console.log(res.data.message);
            setBackEndData([...backEndData, res.data.data]);
            setTimeout(() => {
              setFormMessages(false);
              navigate("/todos");
              setIsNavOpen(false);
              setFormMessages("");
            }, 1500);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // Clearing the form inputs
      setInputOnChange({
        id: "",
        title: "",
        date: "",
        message: "",
      });
      setFormMessages("Your content added successfully!");
    }
  };

  // this function for deleting the target item only
  const deleteData = (id) => {
    console.log(id);
    setId(id);
    axios
      .delete("http://localhost:5000/delete/" + id, {
        headers: { Authorization: token },
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 201) {
          setAxiosMessage(res.data);
          setRunDelete((prev) => {
            return prev + 1;
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // now handling onSubmit after edit
  const OnEditSubmitHandle = (event) => {
    const id = editId;
    event.preventDefault();
    const { title, date, message } = inputChange;
    if (title === "" || date === "" || message === "") {
      setFormMessages("Can't submit the form please fill all the inputs!");
    } else {
      axios
        .post("http://localhost:5000/update/" + id, inputChange, {
          headers: { Authorization: token },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
            console.log(res.data);
            setAxiosMessage(res.data);
            setRunAfterEdit(!runAfterEdit);
            setIsModeClicked(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // setting "axiosMessage" again undefined after 1.5s
  useEffect(() => {
    const autoTi = setTimeout(() => {
      setAxiosMessage();
    }, 10);
    return () => {
      clearTimeout(autoTi);
    };
  }, [axiosMessage]);

  // logout function
  const logout = async (navigate) => {
    console.log(token);
    return axios
      .get("http://localhost:5000/logout", {
        headers: { Authorization: token },
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message, {
            position: "top-center",
            autoClose: 2000,
          });
          localStorage.removeItem("FiveMonthToken");
          setRunToken(39);
          navigate("/");
          setIsNavOpen(false);
        }
      })
      .catch((error) => {
        console.log(error);
        const status = error.response.status;
        const message = error.response.data.message;
        if (status === 401) {
          toast.warn(message, {
            position: "top-center",
            autoClose: 2000,
          });
        } else if (status === 500) {
          toast.warn(message, {
            position: "top-center",
            autoClose: 2000,
          });
        }
        setIsNavOpen(false);
      });
  };

  return (
    <myContext.Provider
      value={{
        token,
        isNavOpen,
        runAfterEdit,
        setIsNavOpen,
        setRunToken,
        NewStoryRun,
        setNewStoryRun,
        inputsOnChange,
        OnChangeHandle,
        OnSubmitHandle,
        formMessages,
        setFormMessages,
        setBackEndData,
        backEndData,
        runDelete,
        isLoading,
        setIsLoading,
        setAxiosMessage,
        deleteData,
        isEditModeClicked,
        setIsModeClicked,
        editId,
        setEditId,
        OnEditSubmitHandle,
        inputChange,
        setInputs,
        logout,
      }}
    >
      {children}
    </myContext.Provider>
  );
};

export const MyGlobalContext = () => {
  return useContext(myContext);
};
