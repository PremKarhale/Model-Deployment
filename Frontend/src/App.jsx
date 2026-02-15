import { useState } from 'react'
import './App.css'

// API Base URL - adjust if your backend runs on a different port
const API_URL = 'http://localhost:8000'

const OCCUPATIONS = [
  { value: 'retired', label: 'Retired' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'student', label: 'Student' },
  { value: 'government_job', label: 'Government Job' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'private_job', label: 'Private Job' },
]

const SAMPLE_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Jaipur', 'Lucknow', 'Patna'
]

function App() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    income_lpa: '',
    smoker: false,
    city: '',
    occupation: 'private_job'
  })

  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payload = {
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        income_lpa: parseFloat(formData.income_lpa),
        smoker: formData.smoker,
        city: formData.city,
        occupation: formData.occupation
      }

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Prediction failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      age: '',
      weight: '',
      height: '',
      income_lpa: '',
      smoker: false,
      city: '',
      occupation: 'private_job'
    })
    setResult(null)
    setError(null)
  }

  const fillSampleData = () => {
    setFormData({
      age: '32',
      weight: '75',
      height: '1.75',
      income_lpa: '12',
      smoker: false,
      city: 'Mumbai',
      occupation: 'private_job'
    })
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>🏥 Insurance Premium Predictor</h1>
        <p>Enter your details to predict insurance premium category</p>
      </header>

      <div className="content-grid">
        {/* Input Form Card */}
        <div className="card">
          <div className="card-header">
            <div className="icon">📝</div>
            <h2>Input Parameters</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Age */}
              <div className="form-group">
                <label>
                  <span className="label-icon">🎂</span>
                  Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g., 32"
                  min="1"
                  max="119"
                  required
                />
              </div>

              {/* Weight */}
              <div className="form-group">
                <label>
                  <span className="label-icon">⚖️</span>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 75"
                  min="1"
                  step="0.1"
                  required
                />
              </div>

              {/* Height */}
              <div className="form-group">
                <label>
                  <span className="label-icon">📏</span>
                  Height (meters)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.75"
                  min="0.1"
                  max="2.5"
                  step="0.01"
                  required
                />
              </div>

              {/* Income */}
              <div className="form-group">
                <label>
                  <span className="label-icon">💰</span>
                  Income (LPA)
                </label>
                <input
                  type="number"
                  name="income_lpa"
                  value={formData.income_lpa}
                  onChange={handleInputChange}
                  placeholder="e.g., 12"
                  min="0.1"
                  step="0.1"
                  required
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label>
                  <span className="label-icon">🏙️</span>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Mumbai"
                  list="cities-list"
                  required
                />
                <datalist id="cities-list">
                  {SAMPLE_CITIES.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              {/* Occupation */}
              <div className="form-group">
                <label>
                  <span className="label-icon">💼</span>
                  Occupation
                </label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  required
                >
                  {OCCUPATIONS.map(occ => (
                    <option key={occ.value} value={occ.value}>
                      {occ.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Smoker Checkbox */}
              <div className="form-group full-width">
                <label>
                  <span className="label-icon">🚬</span>
                  Lifestyle
                </label>
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="smoker"
                    checked={formData.smoker}
                    onChange={handleInputChange}
                  />
                  <span>I am a smoker</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Predicting...
                  </>
                ) : (
                  <>
                    🔮 Predict Premium
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
              >
                🔄 Reset
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fillSampleData}
              >
                📋 Sample Data
              </button>
            </div>
          </form>
        </div>

        {/* Results Card */}
        <div className="card">
          <div className="card-header">
            <div className="icon">📊</div>
            <h2>Prediction Results</h2>
          </div>

          {!result && !error && (
            <div className="results-placeholder">
              <div className="placeholder-icon">🎯</div>
              <p>Fill in the form and click "Predict Premium" to see results here</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {result && (
            <div className="result-content">
              <div className="prediction-badge">
                🏆 {result.pridected_catagory}
              </div>

              <div className="confidence-section">
                <div className="confidence-label">
                  <span>Confidence Score</span>
                  <span>{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="probabilities-section">
                <h3>Class Probabilities</h3>
                {Object.entries(result.acitve_smoker_class_probabilities || {}).map(([className, prob]) => (
                  <div key={className} className="probability-item">
                    <span className="class-name">{className.replace(/_/g, ' ')}</span>
                    <span className="class-value">{(prob * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="api-status">
        <span className="status-dot"></span>
        <span>API Endpoint: {API_URL}/predict</span>
      </div>
    </div>
  )
}

export default App
