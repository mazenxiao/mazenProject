/**
 * ComPanyOP / FactoryOP 服务（样例 —— 由 codegen 自动生成）
 *
 * 旧 Ionic `src/providers/mes-service/ComPanyOP.service.ts`、
 * `FactoryOP.service.ts` 的最小可用集合，给 LoginView 走通用。
 */

import { mesSend } from '@/services/adapter'

const PersistenceCode = 'LoginPersistenceCode'

const STR_TYPE =
  'System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089'

export const ComPanyOP = {
  GetAvailCompanies<T = any>(): Promise<T> {
    return mesSend<T>({
      ClassName:
        'YFPO.MES.Library.ComPanyOP, YFPO.MES.Library, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
      FunctionName: 'GetAvailCompanies',
      PersistenceCode,
      Parameters: [],
    })
  },
}

export const FactoryOP = {
  GetUserAvailFactories<T = any>(userAccount: any, companyCode: any): Promise<T> {
    return mesSend<T>({
      ClassName:
        'YFPO.MES.Library.FactoryOP, YFPO.MES.Library, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
      FunctionName: 'GetUserAvailFactories',
      PersistenceCode,
      Parameters: [
        { Name: 'userAccount', Value: userAccount, TypeName: STR_TYPE },
        { Name: 'companyCode', Value: companyCode, TypeName: STR_TYPE },
      ],
    })
  },
}
