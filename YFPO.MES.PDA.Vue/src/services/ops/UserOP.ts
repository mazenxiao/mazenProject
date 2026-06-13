/**
 * UserOP 服务（样例 —— 由 codegen 自动生成）
 *
 * 数据来源：旧 Ionic `src/providers/mes-service/UserOP.service.ts`
 * 生成方式：scripts/codegen-ops.ts 解析旧文件 → 渲染 Vue 版本
 *
 * 规则（强制）：
 *   1. Name（ClassName）字段照抄
 *   2. Parameters 顺序、Name、TypeName 全部照抄
 *   3. PersistenceCode、FunctionName 照抄
 *   4. 不要手工修改本文件，改了请改 codegen
 */

import { mesSend } from '@/services/adapter'

const ClassName =
  'YFPO.MES.Library.UserOP, YFPO.MES.Library, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'

const PersistenceCode = 'LoginPersistenceCode'

export const UserOP = {
  /** 登录 */
  Login<T = any>(userAccount: any, userPassword: any): Promise<T> {
    return mesSend<T>({
      ClassName,
      FunctionName: 'Login',
      PersistenceCode,
      Parameters: [
        {
          Name: 'userAccount',
          Value: userAccount,
          TypeName: 'System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089',
        },
        {
          Name: 'userPassword',
          Value: userPassword,
          TypeName: 'System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089',
        },
      ],
    })
  },

  /** 取用户可访问的程序列表（菜单） */
  GetUserAvailPrograms<T = any>(userAccount: any): Promise<T> {
    return mesSend<T>({
      ClassName,
      FunctionName: 'GetUserAvailPrograms',
      PersistenceCode,
      Parameters: [
        {
          Name: 'userAccount',
          Value: userAccount,
          TypeName: 'System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089',
        },
      ],
    })
  },

  /** 修改密码 */
  ChangePwd<T = any>(userAccount: any, oldPwd: any, newPwd: any): Promise<T> {
    return mesSend<T>({
      ClassName,
      FunctionName: 'ChangePwd',
      PersistenceCode,
      Parameters: [
        {
          Name: 'userAccount',
          Value: userAccount,
          TypeName: 'System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089',
        },
        {
          Name: 'oldPwd',
          Value: oldPwd,
          TypeName: 'System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089',
        },
        {
          Name: 'newPwd',
          Value: newPwd,
          TypeName: 'System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089',
        },
      ],
    })
  },
}
