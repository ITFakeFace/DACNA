import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { getRequest, postRequest, putRequest } from '../../../services/APIService';
import { getUserIdFromToken } from '../../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const statusOptions = [
  { label: 'Active', value: '1' },
  { label: 'Inactive', value: '0' },
];

const CourseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    fullScore: 0,
    passScore: 0,
    bandScore: 0,
    creatorId: '',
    status: '1',
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const res = await getRequest(`/course/${id}`);
          if (res.status) {
            const data = res.data;
            setForm({
              name: data.name,
              description: data.description,
              fullScore: data.fullScore,
              passScore: data.passScore,
              bandScore: data.bandScore,
              creatorId: data.creatorId,
              status: data.status.toString(),
            });
          } else {
            setFeedback({ type: 'error', message: 'Cannot find course!' });
            setTimeout(() => navigate('/admin/courses'), 1500);
          }
        } catch (error) {
          console.error('Error fetching course:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditMode, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Course name is required';
    if (form.fullScore < 0) newErrors.fullScore = 'Full score must be >= 0';
    if (form.passScore < 0) newErrors.passScore = 'Pass score must be >= 0';
    if (form.bandScore < 0) newErrors.bandScore = 'Band score must be >= 0';
    if (!form.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem('token');
    const payload = {
      ...form,
      status: parseInt(form.status),
      creatorId: form.creatorId || getUserIdFromToken(token),
    };

    try {
      const res = isEditMode
        ? await putRequest(`/course/${id}`, payload, token)
        : await postRequest('/course', payload, token);

      if (res.status) {
        setFeedback({ type: 'success', message: res.statusMessage || 'Success' });
        setTimeout(() => navigate('/admin/courses', { state: { refresh: true } }), 1500);
      } else {
        setFeedback({ type: 'error', message: res.statusMessage || 'Operation failed' });
      }
    } catch (error) {
      console.error('Submit Error:', error);
      setFeedback({ type: 'error', message: isEditMode ? 'Update failed' : 'Create failed' });
    }
  };

  return (
    <div className="p-5 max-w-2xl w-full mx-auto">
      <div className="mb-4 flex items-center gap-4">
        <Button icon="pi pi-arrow-left" severity="secondary" className="!bg-transparent !border-none !text-black" onClick={() => navigate('/admin/courses')} />
        <h2 className="text-2xl font-bold">{isEditMode ? 'Update Course' : 'Create New Course'}</h2>
      </div>

      {feedback && (
        <Message severity={feedback.type === 'success' ? 'success' : 'error'} text={feedback.message} className="mb-4" />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">

        {/* Course Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Course Name</label>
          <InputText id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full" />
          {errors.name && <small className="p-error">{errors.name}</small>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <InputTextarea id="description" rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full" />
        </div>

        {/* Full Score */}
        <div>
          <label htmlFor="fullScore" className="block font-medium mb-1">Full Score</label>
          <InputNumber id="fullScore" value={form.fullScore} onValueChange={(e) => handleChange('fullScore', e.value)} className="w-full" min={0} step={0.5} showButtons />
          {errors.fullScore && <small className="p-error">{errors.fullScore}</small>}
        </div>

        {/* Pass Score */}
        <div>
          <label htmlFor="passScore" className="block font-medium mb-1">Pass Score</label>
          <InputNumber id="passScore" value={form.passScore} onValueChange={(e) => handleChange('passScore', e.value)} className="w-full" min={0} step={0.5} showButtons />
          {errors.passScore && <small className="p-error">{errors.passScore}</small>}
        </div>

        {/* Band Score */}
        <div>
          <label htmlFor="bandScore" className="block font-medium mb-1">Band Score</label>
          <InputNumber id="bandScore" value={form.bandScore} onValueChange={(e) => handleChange('bandScore', e.value)} className="w-full" min={0} step={0.5} showButtons />
          {errors.bandScore && <small className="p-error">{errors.bandScore}</small>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block font-medium mb-1">Status</label>
          <Dropdown id="status" value={form.status} onChange={(e) => handleChange('status', e.value)} options={statusOptions} placeholder="Select Status" className="w-full" />
          {errors.status && <small className="p-error">{errors.status}</small>}
        </div>

        {/* Submit Buttons */}
        <div className="text-right flex gap-3 justify-end">
          <Button type="submit" icon="pi pi-check" label={isEditMode ? 'Update' : 'Create'} />
          <Button type="button" label="Cancel" className="p-button-secondary" onClick={() => navigate('/admin/courses')} />
        </div>
      </form>
    </div>
  );
};

export default CourseFormPage;
