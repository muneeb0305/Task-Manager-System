import Alert from "../../components/Alert"

export const handleSuccess = (res) => {
    Alert({ icon: 'success', title: res })
}