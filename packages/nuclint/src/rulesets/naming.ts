import type {
  Linter,
} from 'eslint';

// Naming rules enforce readable, non-abbreviated variable and parameter names
export const namingRules: Linter.RulesRecord = {
  // Blacklist abbreviations and auto-replace with full names
  'unicorn/name-replacements': [
    'error',
    {
      extendDefaultReplacements: false,
      replacements: {
        opts: {
          options: true,
        },
        idx: {
          index: true,
        },
        cb: {
          callback: true,
        },
        expression: {
          expr: true,
        },
        identifier: {
          ident: true,
        },
        pos: {
          position: true,
        },
        num: false,
        function: {
          fn: true,
        },
        lst: {
          list: true,
        },
        para: {
          paragraph: true,
        },
        args: false,
        txt: {
          text: true,
        },
        tbl: {
          table: true,
        },
        arr: {
          array: true,
        },
        len: {
          length: true,
        },
        cmd: {
          command: true,
        },
        btn: {
          button: true,
        },
        evt: {
          event: true,
        },
        doc: {
          document: true,
        },
        msg: {
          message: true,
        },
        val: {
          value: true,
        },
        prev: {
          previous: true,
        },
        cur: {
          current: true,
        },
        acc: {
          accumulator: true,
        },
        el: {
          element: true,
        },
        attr: {
          attribute: true,
        },
        ctx: {
          context: true,
        },
        cfg: {
          config: true,
        },
        src: false,
        dest: {
          destination: true,
        },
        str: {
          string: true,
        },
        obj: {
          object: true,
        },
        err: {
          error: true,
        },
        res: {
          result: true,
        },
        req: {
          request: true,
        },
        hdr: {
          header: true,
        },
        tmp: {
          temporary: true,
        },
        buf: {
          buffer: true,
        },
        fmt: {
          format: true,
        },
        lib: {
          library: true,
        },
        dir: {
          directory: true,
        },
        img: {
          image: true,
        },
        sep: {
          separator: true,
        },
        // desc is ambiguous: description or descending. Allow both
        desc: false,
        lbl: {
          label: true,
        },
        col: {
          column: true,
        },
        pkg: {
          package: true,
        },
        ver: {
          version: true,
        },
        freq: {
          frequency: true,
        },
        cnt: {
          count: true,
        },
        avg: {
          average: true,
        },
        dur: {
          duration: true,
        },
        perm: {
          permission: true,
        },
        del: {
          delete: true,
        },
        sel: {
          selection: true,
        },
        nav: false,
        lang: {
          language: true,
        },
        temp: {
          temperature: true,
        },
        loc: {
          location: true,
        },
        calc: {
          calculate: true,
        },
        init: {
          initialize: true,
        },
        gen: {
          generate: true,
        },
        ext: {
          extension: true,
        },
        orig: {
          original: true,
        },
        mod: {
          module: true,
        },
        re: {
          regex: true,
        },
        ref: false,
        param: {
          parameter: true,
        },
        config: false,
        conf: {
          config: true,
        },
        prop: {
          property: true,
        },
        coll: {
          collection: true,
        },
        exec: {
          execute: true,
        },
        recv: {
          receive: true,
        },
        mgr: {
          manager: true,
        },
        ctl: {
          controller: true,
        },
        dlg: {
          dialog: true,
        },
        tpl: {
          template: true,
        },
        sig: {
          signal: true,
        },
        proc: {
          process: true,
        },
        sess: {
          session: true,
        },
        addr: {
          address: true,
        },
        auth: false,
        dev: false,
        prod: false,
        dist: false,
        alloc: {
          allocation: true,
        },
        dup: {
          duplicate: true,
        },
        iter: {
          iterator: true,
        },
        elem: {
          element: true,
        },
        ns: {
          namespace: true,
        },
        seg: {
          segment: true,
        },
        frag: {
          fragment: true,
        },
        cols: {
          columns: true,
        },
      },
      extendDefaultAllowList: false,
      checkFilenames: false,
      allowList: {
        // Allow common conventions
        props: true,
        ref: true,
        env: true,
        ident: true,
        num: true,
        fn: true,
        NumsLock: true,
        config: true,
      },
    },
  ],
  // Disallow single-character variable names for readability
  'id-length': [
    'error',
    {
      min: 2,
      properties: 'never',
      exceptions: [
        '_',
        'n',
      ],
    },
  ],
};
