// Author - Pratik Sakaria (B00954261)
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './CreateCommunity.css';
import { SERVER_HOST } from '../../api/Config';

const CreateCommunityForm = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(SERVER_HOST + '/users/all');
      setMembers(response.data.users);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const communityId = uuidv4();
    const admin = localStorage.getItem('userId'); // Store userId instead of userEmail
    const newCommunity = {
      community_id: communityId,
      community_name: name,
      community_desc: description,
      community_members_list: selectedMembers,
      admin: admin,
    };

    try {
      await axios.post(SERVER_HOST + '/communities/create', newCommunity);
      console.log('Community Created', newCommunity);
      onClose(); // Close the form after creation
    } catch (error) {
      console.error('Failed to create community', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="communityName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter community name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="communityDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter community description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="communityMembers">
        <Form.Label>Members</Form.Label>
        <Form.Control
          as="select"
          multiple
          value={selectedMembers}
          onChange={(e) => setSelectedMembers(Array.from(e.target.selectedOptions, option => option.value))}
        >
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.username}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Create Community
      </Button>
      <Button variant="secondary" onClick={onClose} className="ml-2">
        Cancel
      </Button>
    </Form>
  );
};

export default CreateCommunityForm;
