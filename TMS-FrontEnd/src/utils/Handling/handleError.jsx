import Alert from "../../components/Alert"

export const handleError = (err) => {
    Alert({ icon: 'error', title: err })
}