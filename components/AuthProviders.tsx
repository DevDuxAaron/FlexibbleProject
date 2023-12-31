"use client"

import { BuiltInProviderType } from 'next-auth/providers'
import { ClientSafeProvider, LiteralUnion, getProviders, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'

type Provider = {
  id: string,
  name: string,
  type: string,
  signinUrl: string,
  callBackUrl: string,
  signinUrlParams: Record<string, string> | null
}

type Providers = Record<string, Provider> | Promise<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>

const AuthProviders = () => {
  const [providers, setProviders] = useState<Providers| Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      // console.log(res);

      setProviders(res)
    }

    fetchProviders()
  }, [])

  if (providers) {
    return (
      <div>
        {Object.values(providers).map((provider: Provider, i)=> <button key={i}>{provider.id}</button>)}
      </div>
    )
  }
}

export default AuthProviders