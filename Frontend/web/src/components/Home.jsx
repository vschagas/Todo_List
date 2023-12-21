import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ModalCreate } from './ModalCreate';
import { ModalEdit } from './ModalEdit';
import { ModalConcluir } from './ModalConcluir';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th class="align-middle">Status</th>
              <th class="align-middle">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.task}</td>
                <td>{task.status}</td>
                <td>
                  <ButtonGroup>
                    <ModalEdit
                      isOpen={isModalEditOpen}
                      onClose={() => setIsModalEditOpen(false)}
                      onUpdateTask={handleUpdate}
                      taskId={task.id}
                      onStatus={ task.status }
                    />

                    <ModalConcluir
                      isOpen={isModalEditOpen}
                      onClose={() => setIsModalEditOpen(false)}
                      onUpdateTask={handleUpdate}
                      taskId={task.id}
                      onStatus={ task.status }
                    />
                  </ButtonGroup>
                </td>
                
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TaskList;