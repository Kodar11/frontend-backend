import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Tasks = ({ token }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium', status: 'pending' });
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();

    // Check if the token is valid, otherwise redirect to login
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchTasks();
        }
    }, [token, navigate]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/tasks/getAllTasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const taskWithUserId = { ...newTask, userId: tokenData.id };

        try {
            await axios.post('http://localhost:4000/api/tasks/createTask', taskWithUserId, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'pending' });
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error.response ? error.response.data : error.message);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setNewTask({ title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority, status: task.status });
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:4000/api/tasks/updateTask/${editingTask.id}`, { ...newTask }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'pending' });
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error.response ? error.response.data : error.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:4000/api/tasks/deleteTask/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error.response ? error.response.data : error.message);
        }
    };

    const handleToggleTaskStatus = async (taskId) => {
        try {
            await axios.put(`http://localhost:4000/api/tasks/toggleTaskStatus/${taskId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error toggling task status:', error.response ? error.response.data : error.message);
        }
    };

    const categorizeTasksByPriority = (tasks) => {
        return tasks.reduce((acc, task) => {
            if (!acc[task.priority]) {
                acc[task.priority] = [];
            }
            acc[task.priority].push(task);
            return acc;
        }, {});
    };

    const categorizedTasks = categorizeTasksByPriority(tasks);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg m-5 border border-gray-300">
  <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Task Management</h2>

  <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="mb-6 bg-indigo-50 p-4 rounded-lg shadow-md border border-indigo-200">
    <h3 className="text-xl font-semibold mb-3 text-indigo-600">
      {editingTask ? 'Edit Task' : 'Add New Task'}
    </h3>
    <input
      type="text"
      value={newTask.title}
      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      placeholder="Task Title"
      required
      className="w-full p-3 border border-indigo-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <textarea
      value={newTask.description}
      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      placeholder="Task Description"
      required
      className="w-full p-3 border border-indigo-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <input
      type="date"
      value={newTask.dueDate}
      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      required
      className="w-full p-3 border border-indigo-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <select
      value={newTask.priority}
      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
      className="w-full p-3 border border-indigo-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
    <select
      value={newTask.status}
      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
      className="w-full p-3 border border-indigo-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
    </select>
    <button
      type="submit"
      className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition duration-200"
    >
      {editingTask ? 'Update Task' : 'Add Task'}
    </button>
  </form>

  {/* Display tasks by priority */}
  <div>
    {Object.keys(categorizedTasks).map(priority => (
      <div key={priority} className="mb-8">
        <h3 className={`text-2xl font-semibold mb-4 ${priority === 'high' ? 'text-red-600' : priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </h3>
        <ul className="space-y-4">
          {categorizedTasks[priority].map(task => (
            <li key={task.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-transform transform hover:scale-105">
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-800">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-500">{`Due: ${new Date(task.dueDate).toLocaleDateString()}`}</p>
              </div>
              <span className={`ml-2 text-sm font-medium ${task.priority ? (task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600') : 'text-gray-500'}`}>
                {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'N/A'}
              </span>
              <span className={`ml-2 text-sm font-medium ${task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'N/A'}
              </span>
              <div className="flex space-x-2 ml-4">
                {task.status === 'pending' && (
                  <button
                    onClick={() => handleToggleTaskStatus(task.id)}
                    className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-500 transition duration-200"
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  onClick={() => handleEditTask(task)}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-500 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</div>

    );
};

export default Tasks;
