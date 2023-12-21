import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

export const ModalCreate = ({ isOpen, onClose, onCreateTask }) => {
  const [show, setShow] = useState(false);
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('Pendente');

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleSave = async () => {
    try {
      let url = 'http://127.0.0.1:8000/create-task/'
      await axios.post(url, {
        task,
        status,
      });

      onCreateTask();
      setTask('');
      setStatus('Pendente');
      handleClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Nova
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Tarefa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="form-group">
              <label for="descricao">Descrição:</label>
              <input
              className="form-control"
              type="text"
              placeholder="Descrição"
              id='descricao'
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            </div>
            <div class="form-group">
              <label for="status">Status:</label>
              <select
              className="form-control"
              id='status'
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
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!task}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
