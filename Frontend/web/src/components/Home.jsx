import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ModalCreate } from './ModalCreate';
import { ModalEdit } from './ModalEdit';


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/read-task/');
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    setIsModalEditOpen(true);
    fetchData();

  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTask = () => {
    handleCloseModal();
    fetchData();
  };


  return (
    <div>
      <h1>Task List</h1>
      <ModalCreate
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateTask={handleCreateTask}
        />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Status</th>
              <th>Editar</th>
              <th>Atualizar</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.task}</td>
                <td>{task.status}</td>
                <td>
                  <ModalEdit
                    isOpen={isModalEditOpen}
                    onClose={() => setIsModalEditOpen(false)}
                    onUpdateTask={handleUpdate}
                    taskId={task.id}
                  />
                </td>
                <td>
                  <button
                    // onClick={(e) => handleUpdate(task.id, e.target.value)}
                    >Concluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;