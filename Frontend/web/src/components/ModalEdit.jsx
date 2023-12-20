import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

export const ModalEdit = ({ isOpen, onClose, onUpdateTask, taskId }) => {
  
  const [show, setShow] = useState(false);
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('Pendente');


  // const handleShow = () => setShow(true);

  const handleShow = () => {

    console.log(taskId);
    // setTask('');
    // setStatus('Pendente');
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleSave = async () => {
    try {
      const url = `http://127.0.0.1:8000/update-task/?id=${taskId}`;
      await axios.put(url, {
        task,
        status,
      });

      onUpdateTask(taskId);
      handleClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Editar
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tarefa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="descricao">Descrição:</label>
              <input
                className="form-control"
                type="text"
                placeholder="Descrição"
                id="descricao"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select
                className="form-control"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pendente">Pendente</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
