import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import classes from './DeleteAlert.module.css'

const DeleteAlert = (props) => {
    const { open, onClose, onConfirm } = props;
  
    const handleConfirm = () => {
      onConfirm(); // Call the onConfirm function passed from the parent
      onClose();   // Close the modal
    };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box className={classes.modal}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Are you sure to delete
            </Typography>
            <div style={{width:'100%',height:'fit-content', margin: '1em auto', justifyContent:'space-between', background:'#ACAAC'}}>
          <button
            style={{
              width: 'fit-content',
              height: '2.5em',
              padding: '0.5em 2em',
              borderRadius: '0 2em',
              border: '1px solid #3B84B0',
              color: '#3B84B0',
              background: '#fff'
            }}
            onClick={onClose}  // Close the modal when "Non" is clicked
          >
            Non
          </button>
          <button
            style={{
              width: 'fit-content',
              height: '2.5em',
              padding: '0.5em 2em',
              borderRadius: '2em 0',
              border: '1px solid #fff',
              color: '#fff',
              background: '#3B84B0'
            }}
            onClick={handleConfirm}  // Call the onConfirm function when "Oui" is clicked
          >
            Oui
          </button>
        </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default DeleteAlert