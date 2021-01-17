import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography'

export default function Code() {
  const router = useRouter()

  return (
    <div>
      <Typography variant={'h2'}>Binance code</Typography>

      <pre>{JSON.stringify(router, null, 2)}</pre>
    </div>
  )
}