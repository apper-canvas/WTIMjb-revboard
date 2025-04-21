import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Users, X, Check, ChevronDown, UserPlus } from 'lucide-react'
import { format } from 'date-fns'

const Teams = () => {
  // State for teams data, search, filter, and modal
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Sales Development',
      description: 'Responsible for outbound prospecting and lead qualification',
      members: 8,
      leader: 'Emma Thompson',
      createdAt: new Date('2023-01-15'),
      performance: 92
    },
    {
      id: 2,
      name: 'Account Executives',
      description: 'Closing deals and managing key customer relationships',
      members: 12,
      leader: 'Michael Chen',
      createdAt: new Date('2023-02-10'),
      performance: 88
    },
    {
      id: 3,
      name: 'Customer Success',
      description: 'Ensuring customer satisfaction and handling renewals',
      members: 6,
      leader: 'Sarah Johnson',
      createdAt: new Date('2023-03-22'),
      performance: 95
    },
    {
      id: 4,
      name: 'Marketing',
      description: 'Lead generation and brand awareness campaigns',
      members: 5,
      leader: 'David Wilson',
      createdAt: new Date('2023-04-05'),
      performance: 84
    },
    {
      id: 5,
      name: 'Product Specialists',
      description: 'Product demonstrations and technical sales support',
      members: 7,
      leader: 'Jessica Martinez',
      createdAt: new Date('2023-05-18'),
      performance: 91
    }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showModal, setShowModal] = useState(false)
  const [currentTeam, setCurrentTeam] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState(null)

  // Initial form state and team form state
  const initialFormState = {
    name: '',
    description: '',
    leader: '',
    members: 1
  }
  
  const [teamForm, setTeamForm] = useState(initialFormState)

  // Filter teams based on search term
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.leader.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort teams based on sort criteria
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === 'performance') {
      return sortOrder === 'asc' ? a.performance - b.performance : b.performance - a.performance
    }
    
    if (sortBy === 'members') {
      return sortOrder === 'asc' ? a.members - b.members : b.members - a.members
    }
    
    if (sortBy === 'createdAt') {
      return sortOrder === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt) 
        : new Date(b.createdAt) - new Date(a.createdAt)
    }
    
    // Default sort by name or other string fields
    const aValue = a[sortBy].toString().toLowerCase()
    const bValue = b[sortBy].toString().toLowerCase()
    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Open modal for creating or editing a team
  const openTeamModal = (team = null) => {
    if (team) {
      setCurrentTeam(team)
      setTeamForm({
        name: team.name,
        description: team.description,
        leader: team.leader,
        members: team.members
      })
    } else {
      setCurrentTeam(null)
      setTeamForm(initialFormState)
    }
    setShowModal(true)
  }

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setTeamForm(prev => ({
      ...prev,
      [name]: name === 'members' ? parseInt(value) || 0 : value
    }))
  }

  // Submit form to create or update a team
  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    if (currentTeam) {
      // Update existing team
      setTeams(teams.map(team => 
        team.id === currentTeam.id 
          ? { ...team, ...teamForm } 
          : team
      ))
    } else {
      // Create new team
      const newTeam = {
        id: teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1,
        ...teamForm,
        createdAt: new Date(),
        performance: Math.floor(Math.random() * 20) + 80 // Random performance between 80-100
      }
      setTeams([...teams, newTeam])
    }
    
    setShowModal(false)
    setTeamForm(initialFormState)
  }

  // Open delete confirmation
  const openDeleteConfirm = (team) => {
    setTeamToDelete(team)
    setShowDeleteConfirm(true)
  }

  // Delete team
  const deleteTeam = () => {
    setTeams(teams.filter(team => team.id !== teamToDelete.id))
    setShowDeleteConfirm(false)
    setTeamToDelete(null)
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Team Management</h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Manage your sales teams and track performance
            </p>
          </div>
          <button
            onClick={() => openTeamModal()}
            className="btn btn-primary mt-4 md:mt-0 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add New Team
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 card p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={handleSearch}
                className="input pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-surface-600 dark:text-surface-400">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="select py-2"
              >
                <option value="name">Team Name</option>
                <option value="members">Member Count</option>
                <option value="performance">Performance</option>
                <option value="createdAt">Created Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn btn-outline py-2 px-3"
              >
                <ChevronDown 
                  size={18} 
                  className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Teams Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-100 dark:bg-surface-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-surface-600 dark:text-surface-300">
                    Team Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-surface-600 dark:text-surface-300">
                    Leader
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-surface-600 dark:text-surface-300 hidden md:table-cell">
                    Members
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-surface-600 dark:text-surface-300 hidden lg:table-cell">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-surface-600 dark:text-surface-300">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-surface-600 dark:text-surface-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {sortedTeams.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-surface-600 dark:text-surface-400">
                      No teams found. Add a new team to get started.
                    </td>
                  </tr>
                ) : (
                  sortedTeams.map(team => (
                    <tr 
                      key={team.id} 
                      className="hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-3">
                            <Users size={16} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-sm text-surface-500 dark:text-surface-400 line-clamp-1 max-w-xs">
                              {team.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{team.leader}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center">
                          <UserPlus size={16} className="mr-2 text-surface-500" />
                          <span>{team.members} members</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="text-surface-600 dark:text-surface-400">
                          {format(team.createdAt, 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 mr-2 max-w-[100px]">
                            <div 
                              className={`h-2 rounded-full ${
                                team.performance >= 90 
                                  ? 'bg-secondary' 
                                  : team.performance >= 70 
                                    ? 'bg-primary' 
                                    : 'bg-accent'
                              }`}
                              style={{ width: `${team.performance}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{team.performance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openTeamModal(team)}
                            className="p-1 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                          >
                            <Edit size={18} className="text-primary" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(team)}
                            className="p-1 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                          >
                            <Trash2 size={18} className="text-accent" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Create/Edit Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-soft w-full max-w-md"
          >
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-xl font-semibold">
                {currentTeam ? 'Edit Team' : 'Create New Team'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    Team Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={teamForm.name}
                    onChange={handleFormChange}
                    className="input"
                    placeholder="Enter team name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={teamForm.description}
                    onChange={handleFormChange}
                    className="input min-h-[80px]"
                    placeholder="Enter team description"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="leader">
                    Team Leader
                  </label>
                  <input
                    type="text"
                    id="leader"
                    name="leader"
                    value={teamForm.leader}
                    onChange={handleFormChange}
                    className="input"
                    placeholder="Enter team leader name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="members">
                    Number of Members
                  </label>
                  <input
                    type="number"
                    id="members"
                    name="members"
                    value={teamForm.members}
                    onChange={handleFormChange}
                    className="input"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {currentTeam ? 'Update Team' : 'Create Team'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-soft w-full max-w-md"
          >
            <div className="p-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mx-auto mb-4">
                <Trash2 size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                Delete Team
              </h3>
              <p className="text-center text-surface-600 dark:text-surface-400">
                Are you sure you want to delete the team "{teamToDelete?.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTeam}
                  className="btn bg-accent hover:bg-accent/90 text-white"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Teams