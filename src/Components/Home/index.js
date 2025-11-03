import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Header from '../Header'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class Home extends Component {
  state = {apiStatus: apiStatusConst.initial, details: {},activeOptionId : categoriesList[0].id}

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    const {activeOptionId} = this.state
    this.setState({
      apiStatus: apiStatusConst.progress,
    })
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        details: updatedData,
        apiStatus: apiStatusConst.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConst.failure,
      })
    }
  }

  renderSuccess = () => {
    const {details} = this.state
    return (
      <ul>
        {details.map(each => (
          <li key={each.id}>
            <img src={each.imageUrl} alt={each.name} />
            <p>{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  retryButton = () => {
    this.getDetails()
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.retryButton}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="threeDots" height={50} width={50} />
    </div>
  )

  renderDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.success:
        return this.renderSuccess()
      case apiStatusConst.failure:
        return this.renderFailure()
      case apiStatusConst.progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  updateActiveOption = (event) => {
    this.setState({
      activeOptionId : event.target.value
    },this.getDetails)
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <div>
        <Header />
        <select value = {activeOptionId} onChange = {this.updateActiveOption}>
          {
            categoriesList.map(each => (
              <option key = {each.id} value = {each.id}>{each.displayText}</option>
            ))
          }
        </select>
        <div>{this.renderDetails()}</div>
      </div>
    )
  }
}
export default Home
