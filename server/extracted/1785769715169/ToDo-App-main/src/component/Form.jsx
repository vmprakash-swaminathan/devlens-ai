import React, { useEffect, useState } from "react";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { AiOutlinePlus } from "react-icons/ai";
import ToDo from "./ToDo";
import { db } from "../firebase";

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4 mt-10`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-center`,
  input: `border w-full p-2 text-xl`,
  button: `border p-4 ml-2 bg-purple-700 text-slate-100`,
  count: `text-center p-2`,
};

const Form = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const q = query(collection(db, "todos"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];

      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });

    return () => unsubscribe();
  }, []);

  // update todos
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  // create todo
  const createTodo = async (e) => {
    e.preventDefault();

    if (input === "") {
      return alert("Please Enter a valid ToDo!");
    }

    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    });
    setInput("");
  };

  //delete todos
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>ToDo App</h3>
        <form className={style.form} onSubmit={createTodo}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={style.input}
            type="text"
            placeholder="Add ToDo"
          />
          <button className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => {
            return (
              <ToDo
                key={index}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
              />
            );
          })}
        </ul>
        {todos.length ? (
          <p className={style.count}>You have {todos.length} todos</p>
        ) : null}
      </div>
    </div>
  );
};

export default Form;
