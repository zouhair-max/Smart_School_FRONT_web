import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../../../context/AuthContext'
import { X, Plus, Edit2, Trash2, School, MapPin, Phone, Mail, Search, Upload, ImageIcon, Menu, Filter } from 'lucide-react'

export default function SchoolModal() {
  const { currentUser } = useAuth()
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingSchool, setEditingSchool] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [logoPreview, setLogoPreview] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: null,
    is_active: true
  })

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      if (!currentUser) return
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/schools', {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        })
        setSchools(response.data.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load schools.')
      } finally {
        setLoading(false)
      }
    }
    fetchSchools()
  }, [currentUser])

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  // Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, logo: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Open modal for Add
  const handleAdd = () => {
    setEditingSchool(null)
    setFormData({ name: '', address: '', phone: '', email: '', logo: null, is_active: true })
    setLogoPreview(null)
    setShowModal(true)
  }

  // Open modal for Edit
  const handleEdit = (school) => {
    setEditingSchool(school)
    setFormData({
      name: school.name,
      address: school.address,
      phone: school.phone,
      email: school.email,
      logo: null,
      is_active: school.is_active
    })
    setLogoPreview(school.logo ? `http://127.0.0.1:8000/storage/${school.logo}` : null)
    setShowModal(true)
  }

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('address', formData.address)
      submitData.append('phone', formData.phone)
      submitData.append('email', formData.email)
      submitData.append('is_active', formData.is_active ? 1 : 0)
      if (formData.logo) {
        submitData.append('logo', formData.logo)
      }

      if (editingSchool) {
        await axios.post(`http://127.0.0.1:8000/api/schools/${editingSchool.id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        // Refresh the list
        const response = await axios.get('http://127.0.0.1:8000/api/schools', {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        })
        setSchools(response.data.data)
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/schools', submitData, {
          headers: { 
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        setSchools([...schools, response.data])
      }
      setShowModal(false)
      setLogoPreview(null)
    } catch (err) {
      console.error(err)
      setError('Failed to save school.')
    }
  }

  // Delete school
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this school?')) return
    try {
      await axios.delete(`http://127.0.0.1:8000/api/schools/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      })
      setSchools(schools.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
      setError('Failed to delete school.')
    }
  }

  // Fixed search filter
  const filteredSchools = schools.filter(school => {
    const search = searchTerm.toLowerCase().trim()
    return (
      (school.name || '').toLowerCase().includes(search) ||
      (school.address || '').toLowerCase().includes(search) ||
      (school.phone || '').toLowerCase().includes(search)
    )
  })

  // Mobile Menu Component
  const MobileMenu = () => {
    if (!mobileMenuOpen) return null

    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4">
            <div className="space-y-2">
              <div className="px-3 py-2 text-sm font-medium text-gray-900 bg-violet-50 rounded-lg">
                School Management
              </div>
              <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Dashboard
              </div>
              <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Users
              </div>
              <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Settings
              </div>
            </div>
          </nav>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading schools...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900 truncate">School Management</h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <MobileMenu />

      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <School className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">School Management</h1>
                <p className="text-gray-500 text-sm">Manage and organize your schools</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 bg-violet-600 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium hover:bg-violet-700 transition-colors shadow-sm w-full lg:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add School</span>
            </button>
          </div>
        </div>

        {/* Search and Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, address, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors lg:hidden">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {filteredSchools.length === 0 ? (
            <div className="p-6 sm:p-8 lg:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <School className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No schools found' : 'No schools yet'}
              </h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first school'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAdd}
                  className="bg-violet-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-violet-700 transition-colors text-sm sm:text-base"
                >
                  Add Your First School
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {/* Mobile Card View */}
                <div className="lg:hidden">
                  {filteredSchools.map((school) => (
                    <div key={school.id} className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {school.logo ? (
                            <img 
                              src={`http://127.0.0.1:8000/storage/${school.logo}`} 
                              alt={school.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <School className="w-6 h-6 text-violet-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{school.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            school.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {school.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{school.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{school.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{school.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(school)}
                          className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(school.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="w-full hidden lg:table">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSchools.map((school) => (
                      <tr 
                        key={school.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {school.logo ? (
                                <img 
                                  src={`http://127.0.0.1:8000/storage/${school.logo}`} 
                                  alt={school.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <School className="w-5 h-5 text-violet-600" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{school.name}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate max-w-[200px]">{school.address}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm">{school.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate max-w-[200px]">{school.email}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              school.is_active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {school.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(school)}
                              className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(school.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{filteredSchools.length}</span> of{' '}
                  <span className="font-medium text-gray-900">{schools.length}</span> schools
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <School className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingSchool ? 'Edit School' : 'Add New School'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 sm:p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      School Logo
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 flex-shrink-0">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                          PNG, JPG or GIF (Max 2MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* School Details Section */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 uppercase tracking-wide">
                      School Details
                    </h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          School Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                          placeholder="Enter school name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          rows="3"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
                          placeholder="Enter complete address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Details Section */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 uppercase tracking-wide">
                      Contact Details
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                          placeholder="Your Phone Number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                          placeholder="Your Email Address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 uppercase tracking-wide">
                      Status
                    </h3>
                    
                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 border-gray-300 rounded focus:ring-2 focus:ring-violet-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        School is active and operational
                      </span>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors shadow-sm text-sm sm:text-base order-1 sm:order-2"
                  >
                    {editingSchool ? 'Update School' : 'Create School'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}