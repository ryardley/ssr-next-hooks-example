import React from "react";
import { renderToString } from "react-dom/server";

// Can be set to point to a generated file
import funcLookup from "../funcs";

let _hooksCache = {};

type Fn = { name: string };

function serialize(value: any) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    if (err.message.indexOf("circular structure")) {
      throw new Error(`Circular structure in found`);
    }
    throw err;
  }
}

const HooksCache = {
  get(fn: Fn, args: any) {
    const serializedArgs = serialize(args);
    const serializedFn = fn.name;
    return _hooksCache[serializedFn] && _hooksCache[fn.name][serializedArgs];
  },
  set(fn: Fn, args: any, value: any) {
    const serializedArgs = serialize(args);
    const serializedFn = fn.name;
    if (_hooksCache[serializedFn] === undefined) {
      _hooksCache[serializedFn] = {};
    }
    _hooksCache[serializedFn][serializedArgs] = value;
  },
  entries() {
    return Object.entries(_hooksCache);
  },

  object() {
    return _hooksCache;
  },

  fromEntries(entries) {
    _hooksCache = Object.fromEntries(entries);
  },
  reset() {
    _hooksCache = {};
  }
};

// Hydrate from next as the module loads
type NextWindow = { __NEXT_DATA__: any };
if (typeof window !== "undefined") {
  const nextWindow = (window as any) as NextWindow;
  if (nextWindow.__NEXT_DATA__) {
    try {
      HooksCache.fromEntries(
        nextWindow.__NEXT_DATA__.props.pageProps.__hooksCache
      );
    } catch (err) {
      throw new Error(`Error hydrating hooks cache from Next.`);
    }
  }
}

export const HOOKS_RESULT_PLACEHOLDER = "HOOKS_RESULT_PLACEHOLDER";

export function withSsrHooks(Page) {
  const origGetInitialProps = Page.getInitialProps || (() => ({}));

  Page.getInitialProps = async ctx => {
    const { AppTree } = ctx;
    // This runs each hook which saves calls to the cache
    renderToString(<AppTree />);

    // Extract calls from the cache and run them
    await processHooksCacheQueue(HooksCache.entries());

    // get the cache again to serialize
    const __hooksCache = HooksCache.entries();
    const out = await origGetInitialProps(ctx);
    return { ...out, __hooksCache }; // send to next's serialization
  };

  return Page;
}

const isServer = () => typeof window === "undefined";

export function processInput(computation, args) {
  // This is our isomorphic cache

  const value = HooksCache.get(computation, args);
  if (isServer() && value == null) {
    HooksCache.set(computation, args, HOOKS_RESULT_PLACEHOLDER);
  }
  return value;
}

type FnCallSerialization = { [k: string]: any };

async function processHooksCacheQueue(
  entries: Array<[string, FnCallSerialization]>
) {
  for (const [fName, calls] of entries) {
    for (const [serializedArgs] of Object.entries(calls)) {
      const func = funcLookup[fName];
      const deserializedArgs = JSON.parse(serializedArgs);
      try {
        const argsArray = Array.isArray(deserializedArgs)
          ? deserializedArgs
          : [deserializedArgs];

        const result = await func(...argsArray);
        HooksCache.set({ name: fName }, deserializedArgs, result);
      } catch (err) {
        throw err;
      }
    }
  }
}
