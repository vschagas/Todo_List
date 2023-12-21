import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

export const ModalConcluir = (
  { isOpen, onClose, onUpdateTask, taskId, onStatus }) => {

  const [show, setShow] = useState(false);
  const [task, setTask] = useState('');

  const fetchData = async () => {
    try {
      let url = `http://127.0.0.1:8000/read-task-id/?id=${ taskId }`;
      const response = await axios.get(url);
      setTask(response.data.task);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSave = async () => {
    try {
      const url = `http://127.0.0.1:8000/update-task/?id=${taskId }`;

      await axios.put(url, {
        task: task.task,
        status: "Concluído"
      });

      onUpdateTask(taskId);
      handleClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  const handleShow = () => {
    setShow(true);
    fetchData()
  };

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={handleShow}
        disabled={onStatus === 'Concluído'}>
        Concluir
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deseja concluir essa tarefa?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="descricao">Descrição:</label>
              <input
                className="form-control"
                disabled
                placeholder={task.task}
                id="descricao"
                onChange={(e) => setTask(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status:</label>
                <input
                  className="form-control"
                  disabled
                  placeholder={"Concluído"}
                  id="status"
                  
                />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="success" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
